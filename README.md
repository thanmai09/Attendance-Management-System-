# EduTrack - Attendance Management System

A comprehensive attendance management system built with React.js frontend and designed to work with a Flask backend. This system provides role-based access control for administrators, teachers, and students.

## 🚀 Features

### Core Features
- **Role-based Authentication**: Separate interfaces for Admin, Teacher, and Student roles
- **Student Management**: Add, edit, delete, and search students
- **Attendance Tracking**: Mark attendance with Present/Absent/Late status
- **Real-time Dashboard**: Live statistics and attendance analytics
- **Comprehensive Reports**: Generate detailed attendance reports and analytics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Design Elements
- **Modern UI**: Clean, professional interface with smooth animations
- **Interactive Components**: Hover effects, transitions, and micro-interactions
- **Comprehensive Color System**: Blue primary, green success, red error, yellow warning themes
- **Typography**: Inter font family with proper spacing and hierarchy
- **Responsive Grid**: Mobile-first design with breakpoints for all screen sizes

## 🛠️ Technology Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for build tooling

### Backend (Ready for Integration)
- **Flask** (Python web framework)
- **SQLAlchemy** (Database ORM)
- **JWT** (Authentication)
- **SQLite/PostgreSQL** (Database)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/attendance-management-system.git
cd attendance-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔐 Demo Accounts

The system includes demo accounts for testing:

- **Admin**: `admin@edutrack.com` / `admin123`
- **Teacher**: `teacher@edutrack.com` / `teacher123`
- **Student**: `student@edutrack.com` / `student123`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, Modal)
│   ├── Layout.tsx      # Main layout component
│   ├── Header.tsx      # Header component
│   └── Sidebar.tsx     # Navigation sidebar
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Dashboard.tsx   # Dashboard page
│   ├── Students.tsx    # Student management
│   ├── Attendance.tsx  # Attendance marking
│   ├── Reports.tsx     # Reports and analytics
│   └── Settings.tsx    # Settings page
├── context/            # React contexts
│   └── AuthContext.tsx # Authentication context
├── data/               # Mock data
│   └── mockData.ts     # Sample data for development
├── types/              # TypeScript type definitions
│   └── index.ts        # Type definitions
└── App.tsx             # Main app component
```

## 🌟 Key Features Breakdown

### Dashboard
- Real-time attendance statistics
- Monthly attendance trends
- Recent activity feed
- Quick action buttons

### Student Management
- Add/edit/delete students
- Search and filter functionality
- Bulk operations
- Student profiles with photos

### Attendance System
- Daily attendance marking
- Multiple status options (Present/Absent/Late)
- Real-time statistics
- Bulk attendance marking

### Reports & Analytics
- Comprehensive attendance reports
- Department-wise analytics
- Monthly and yearly trends
- Export functionality (CSV)

### Settings
- User profile management
- Notification preferences
- Security settings
- System configuration

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#22C55E)
- **Warning**: Yellow (#EAB308)
- **Error**: Red (#EF4444)
- **Info**: Purple (#A855F7)

### Typography
- **Font Family**: Inter
- **Weights**: 300, 400, 500, 600, 700
- **Line Height**: 1.6 for body, 1.2 for headings

### Spacing
- **System**: 8px base unit
- **Consistent**: 4px, 8px, 16px, 24px, 32px, 48px

## 🔧 Flask Backend Integration

To integrate with a Flask backend, create the following API endpoints:

### Authentication
```python
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

### Students
```python
GET /api/students
POST /api/students
PUT /api/students/:id
DELETE /api/students/:id
```

### Attendance
```python
GET /api/attendance
POST /api/attendance
PUT /api/attendance/:id
GET /api/attendance/reports
```

### Dashboard
```python
GET /api/dashboard/stats
GET /api/dashboard/activity
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Frontend Deployment
1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider (Netlify, Vercel, etc.)

### Backend Deployment
1. Set up your Flask application with the required API endpoints
2. Deploy to a cloud provider (Heroku, AWS, DigitalOcean)
3. Update the API base URL in the frontend configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern education platforms
- Icons by Lucide React
- Photos from Pexels
- Built with React.js and Tailwind CSS

## 📞 Support

For support, email support@edutrack.com or create an issue in the GitHub repository.