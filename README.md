# Household Billing Splitting and Payment Tracking System

A modern React-based SaaS dashboard for managing household expenses, splitting costs among members, and tracking payments.

## Features

### Authentication System
- **Login** - Secure login with demo credentials: `demo@example.com` / `password123`
- **Sign Up** - Create new user accounts
- **Forgot Password** - Reset password with verification code
- **Account Lock** - Auto-locks after 3 failed login attempts for security

### Dashboard
- Total expenses overview
- Total payments tracking
- Remaining balance calculation
- Recent expenses list
- Summary statistics
- Member count

### Expense Management
- Add new expenses with title, amount, and date
- Multi-select members to split expenses
- Auto-split calculation per member
- Expense history tracking

### Members Management
- Add household members with name and email
- View all members
- Track individual member balances
- Visual member cards with balance information

### Payments Tracking
- Record payments from members
- Payment history table
- Track payment descriptions
- Update member balances automatically

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 with modern gradients and animations
- **State Management**: React Hooks (useState)
- **Storage**: Browser localStorage for data persistence

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Navigation bar component
│   ├── Navbar.css
│   ├── Dashboard.jsx        # Dashboard overview
│   ├── Dashboard.css
│   ├── AddExpense.jsx       # Expense form
│   ├── AddExpense.css
│   ├── Members.jsx          # Members management
│   ├── Members.css
│   ├── Payments.jsx         # Payment tracking
│   └── Payments.css
├── pages/
│   ├── Login.jsx            # Login page
│   ├── Signup.jsx           # Sign up page
│   ├── ForgotPassword.jsx   # Password reset
│   └── Auth.css             # Authentication styles
├── App.jsx                  # Main app component
├── App.css
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd rrrr
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Demo Credentials

**Login:**
- Email: `demo@example.com`
- Password: `password123`

## Features in Detail

### Authentication
- Secure login with attempt tracking
- Account automatic locking after 3 failed attempts
- Email verification for password reset
- User registration with validation

### Dashboard
- Real-time calculation of totals
- Visual cards with gradient backgrounds
- Recent expenses list
- Quick statistics summary

### Add Expense
- Form with validation
- Multi-select member picker
- Auto-calculated split amounts
- Transaction preview panel

### Members
- Add members with email validation
- Visual member cards with avatars
- Balance tracking (owes/owed)
- Responsive grid layout

### Payments
- Dropdown member selector
- Payment history table
- Date tracking
- Description field

## Styling

The application uses a modern SaaS dashboard design inspired by Stripe and Notion:
- Gradient backgrounds and card shadows
- Responsive grid layouts
- Smooth transitions and hover effects
- Color-coded balance indicators
- Mobile-first responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- User authentication with JWT
- Database persistence
- Export to PDF/CSV
- Email notifications
- Bill splitting algorithms
- Monthly budgets
- Admin dashboard

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please refer to the inline code comments or documentation.

---

Happy expense splitting! 💳
