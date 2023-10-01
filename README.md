# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.


# Challenge Requirements

1. **Create an E-commerce Store**: Participants are required to build a functional web app, specifically an e-commerce store.
2. **Login Page**: The store must have a login page for Super Admins (Spense), Vendors (merchants), and end-users (shoppers).
3. **Super Admin Dashboard**: Super Admin should be able to view and edit vendors, products, inventory and also be able to monitor reviews, ratings, and orders.
4. **Vendor Dashboard**: Vendors should be able to add products, manage inventory, and perform CRUD operations.
5. **Customer Functionality**: End-users should be able to view products, add them to the cart, and checkout.
6. **Payment Gateway**: No payment gateway integration is required. However, a success and failure response after checkout should be implemented.
7. **Data Tracking & Analytics**: The app should be able to track user behaviour, including the products viewed, added to the cart, and purchased. Furthermore, events should be fired at key interactions to enable the collection of analytical data for improving the platform.
8. **Discount Campaigns**: The app should be able to run multiple discount campaigns. This would require a system for managing discount codes, tracking their usage, and applying them during the checkout process. For example: 10% off on HDFC Regalia Credit Card; 15% off on ICICI Platinum Credit Card.
9. **Reward Coins**: A reward system should be implemented where users earn coins when they shop. The mechanism of how the coins are calculated, stored, and redeemed should be carefully designed.
10. **Technology Stack**: Any JavaScript framework for Frontend and Node.js for Backend is acceptable.
11. **Compatibility**: The app should be responsive and compatible with different browsers.


Candy House (super admin handles orders)
Vendors must raise a request to add products or change inventory
Vendors get notified when a new order is placed
Vendors have access to analytics
Create a candysubmission request model which only has ref of candy, vendor and approval status (canduy also has approval status field)
Store info like balance, totalCoinsEarned, totalCoinsredeemed for reward coins. 1 coin for every 10 rupees spent. 100 coins can be used to get 10 rupees discount.
Create functionality to run discount coupons for banks by admins

 
TODO:
make mongodb operations as transactions
