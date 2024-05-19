const List = require('../models/List');
const User = require('../models/User');
const csv = require('csv-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Create a new list
const createList = async (req, res) => {
    const { title, name, properties } = req.body;

    try {
        // Check if list with the same name already exists
        const existingList = await List({ name });
        if (existingList) {
            return res.status(400).json({ error: 'List with the same name already exists' });
        }

        // Create a new list
        const newList = new List({ title, name, properties });
        await newList.save();
        res.status(201).json(newList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add users to a list from CSV file
const addUsers = async (req, res) => {
    const listId = req.params.id;
    const filePath = req.file.path;
    let addedCount = 0;
    let failedCount = 0;
    let errors = [];
    const users = [];

    try {
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Fetch emails of all existing users
        const existingUserEmails = new Set();
        const existingUsers = await User.find({}, { email: 1 });
        existingUsers.forEach(user => existingUserEmails.add(user.email.toLowerCase()));

        // Array to store user objects
        const userObjects = [];

        // Process CSV data
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', async (row) => {
                try {
                    const { name, email, ...customProps } = row;
                    if (!name || !email) {
                        throw new Error('Name and email are required');
                    }

                    // Check if user email already exists
                    if (existingUserEmails.has(email.toLowerCase())) {
                        throw new Error(`User with email ${email} already exists`);
                    }

                    // Create new user object
                    const properties = new Map();
                    list.properties.forEach(prop => {
                        properties.set(prop.title, customProps[prop.title] || prop.fallback);
                    });
                    const user = new User({ name, email, properties });
                    userObjects.push(user);
                    addedCount++;
                } catch (error) {
                    failedCount++;
                    errors.push({ row, error: error.message });
                }
            })
            .on('end', async () => {
                try {
                    // Save all user objects to the database
                    await User.insertMany(userObjects);

                    // Update list with user IDs
                    userObjects.forEach(user => {
                        if (!list.users.includes(user._id)) {
                            list.users.push(user._id);
                        }
                    });

                    // Save the updated list
                    list.markModified('users');
                    await list.save();

                    // Delete the uploaded file after processing
                    fs.unlinkSync(filePath);

                    res.status(200).json({
                        addedCount,
                        failedCount,
                        errors,
                        totalCount: list.users.length
                    });
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send email to users in a list
const sendEmail = async (req, res) => {
    const listId = req.params.id;

    try {
        const list = await List.findById(listId).populate('users');
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sharaneshwarcodespace@gmail.com',
                pass: process.env.APP_PASSWORD
            }
        });

        list.users.forEach(user => {
            const userProps = {};
            user.properties.forEach((value, key) => {
                userProps[key] = value;
            });

            // Define email subject
            const emailSubject = `Welcome to ${list.name}`;

            // Define email body with placeholders
            const emailBody = `Hey ${user.name}!\n\nThank you for signing up with your email ${user.email}. We have received your city as ${userProps.city} and your grade as ${userProps.grade}.\n\nTeam MathonGo.`;

            const mailOptions = {
                from: 'Sharaneshwar Punjal <sharaneshwarcodespace@gmail.com>',
                to: user.email,
                subject: emailSubject,
                text: emailBody,
                html: `<p>${emailBody.replace(/\n/g, '<br>')}</p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`Error sending email to ${user.email}:`, error);
                } else {
                    console.log(`Email sent to ${user.email}:`, info.response);
                }
            });
        });

        res.status(200).json({ message: 'Emails sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createList, addUsers, sendEmail };
