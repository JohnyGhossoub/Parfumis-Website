// netlify/functions/submitContact.js
const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
    // Only accept POST requests.
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse the form data (assuming it's sent as JSON)
    let data;
    try {
        data = JSON.parse(event.body);
    } catch (err) {
        return { statusCode: 400, body: "Invalid JSON" };
    }

    // Get the form type from the query parameters (or from the data)
    const type = event.queryStringParameters.type || data.contactReason || "general";

    // Determine the recipient email based on the type.
    let recipientEmail;
    switch (type) {
        case "issue":
            recipientEmail = "support@parfumis.com";
            break;
        case "host":
            recipientEmail = "host@parfumis.com";
            break;
        case "buy":
            recipientEmail = "buy@parfumis.com";
            break;
        case "ad":
            recipientEmail = "ads@parfumis.com";
            break;
        case "request":
            recipientEmail = "request@parfumis.com";
            break;
        case "general":
        default:
            recipientEmail = "info@parfumis.com";
            break;
    }

    // Set up your Nodemailer transporter using the provided credentials.
    const transporter = nodemailer.createTransport({
        service: "Gmail", // or another email service
        auth: {
            user: "forms@parfumis.com",   // Sender email address
            pass: "u9B0tOZIAy2B3U@9"        // Password for the sender account
        },
    });

    // Create the email content, including the replyTo field.
    const mailOptions = {
        from: "forms@parfumis.com",
        to: recipientEmail,
        subject: `New Contact Form Submission: ${type}`,
        text: `You received a new submission:\n\n${JSON.stringify(data, null, 2)}`,
        // Set the reply-to header to the user's email from the form data.
        replyTo: data.email,
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Email sent successfully." }),
        };
    } catch (error) {
        console.error("Email sending error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "Failed to send email." }),
        };
    }
};
