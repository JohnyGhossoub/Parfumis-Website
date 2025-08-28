# Parfumis Contact Form Email Routing

This document outlines how different contact form submissions are routed to specific email addresses.

## Email Routing Configuration

| Form Type | Form Label | Recipient Email | Purpose |
|-----------|------------|-----------------|---------|
| `issue` | Report Issue | **support@parfumis.com** | Customer support and technical issues |
| `general` | General Inquiry | **support@parfumis.com** | General questions and support |
| `host` | Host Parfumis | **info@parfumis.com** | Business partnership inquiries |
| `buy` | Buy Parfumis | **info@parfumis.com** | Purchase and sales inquiries |
| `ad` | Parfumis Ads | **marketing@parfumis.com** | Advertising and marketing inquiries |
| `request` | Parfum Request | **info@parfumis.com** | Product requests and inquiries |

## Email Subject Lines

Each form type generates a specific subject line:
- **Issue Report**: "Issue Report: Issue Form"
- **General Inquiry**: "General Inquiry: General Form"  
- **Host Parfumis**: "Host Parfumis Request: Host Form"
- **Buy Parfumis**: "Purchase Interest: Buy Form"
- **Parfumis Ads**: "Advertising Inquiry: Ad Form"
- **Parfum Request**: "Parfum Request: Request Form"

## Technical Details

- **Sender Email**: forms@parfumis.com
- **Reply-To**: Set to the customer's email address from the form
- **Function**: `/submitContact?type={formType}`
- **Platform**: Netlify Serverless Functions

## Setup Requirements

1. Ensure all recipient email addresses exist and are monitored
2. The `nodemailer` dependency is included in `package.json`
3. Netlify function is properly configured in `netlify.toml`
