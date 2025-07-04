# Flask Backend Integration Guide

This guide provides a complete Flask backend implementation for the EduTrack Attendance Management System.

## 🛠️ Backend Setup

### 1. Project Structure
```
backend/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── models.py             # Database models
├── routes/               # API routes
│   ├── __init__.py
│   ├── auth.py          # Authentication routes
│   ├── students.py      # Student management routes
│   ├── attendance.py    # Attendance routes
│   └── dashboard.py     # Dashboard routes
├── utils/               # Utility functions
│   ├── __init__.py
│   ├── auth.py         # Authentication utilities
│   └── helpers.py      # Helper functions
└── requirements.txt     # Python dependencies
```

### 2. Requirements (requirements.txt)
```txt
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-JWT-Extended==4.5.2
Flask-CORS==4.0.0
Flask-Migrate==4.0.5
Werkzeug==2.3.7
python-dotenv==1.0.0
bcrypt==4.0.1
```

### 3. Configuration (config.py)
```python
import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///attendance.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
```

### 4. Database Models (models.py)
```python
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, teacher, student
    department = db.Column(db.String(100))
    avatar = db.Column(db.String(255))
    join_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'department': self.department,
            'avatar': self.avatar,
            'joinDate': self.join_date.isoformat() if self.join_date else None,
            'isActive': self.is_active
        }

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    roll_number = db.Column(db.String(20), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    section = db.Column(db.String(10), nullable=False)
    avatar = db.Column(db.String(255))
    join_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    attendance_records = db.relationship('AttendanceRecord', backref='student', lazy=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'rollNumber': self.roll_number,
            'department': self.department,
            'year': self.year,
            'section': self.section,
            'avatar': self.avatar,
            'joinDate': self.join_date.isoformat() if self.join_date else None,
            'isActive': self.is_active
        }

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    credits = db.Column(db.Integer, default=3)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    teacher = db.relationship('User', backref='subjects')
    attendance_records = db.relationship('AttendanceRecord', backref='subject', lazy=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'code': self.code,
            'department': self.department,
            'teacher': self.teacher.name if self.teacher else None,
            'credits': self.credits,
            'isActive': self.is_active
        }

class AttendanceRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # present, absent, late
    remarks = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    teacher = db.relationship('User', backref='attendance_records')

    def to_dict(self):
        return {
            'id': str(self.id),
            'studentId': str(self.student_id),
            'studentName': self.student.name,
            'rollNumber': self.student.roll_number,
            'subject': self.subject.name,
            'teacher': self.teacher.name,
            'date': self.date.isoformat(),
            'status': self.status,
            'remarks': self.remarks,
            'timestamp': self.created_at.isoformat()
        }
```

### 5. Authentication Routes (routes/auth.py)
```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email, is_active=True).first()
        
        if user and user.check_password(password):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({
                'access_token': access_token,
                'user': user.to_dict()
            }), 200
        
        return jsonify({'error': 'Invalid credentials'}), 401
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify(user.to_dict()), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Successfully logged out'}), 200
```

### 6. Student Routes (routes/students.py)
```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Student, User, db
from sqlalchemy import or_

students_bp = Blueprint('students', __name__)

@students_bp.route('', methods=['GET'])
@jwt_required()
def get_students():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        department = request.args.get('department', '')
        year = request.args.get('year', type=int)

        query = Student.query.filter_by(is_active=True)

        if search:
            query = query.filter(
                or_(
                    Student.name.ilike(f'%{search}%'),
                    Student.roll_number.ilike(f'%{search}%'),
                    Student.email.ilike(f'%{search}%')
                )
            )

        if department:
            query = query.filter(Student.department == department)

        if year:
            query = query.filter(Student.year == year)

        students = query.paginate(
            page=page, per_page=per_page, error_out=False
        )

        return jsonify({
            'students': [student.to_dict() for student in students.items],
            'total': students.total,
            'pages': students.pages,
            'current_page': students.page,
            'per_page': students.per_page
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@students_bp.route('', methods=['POST'])
@jwt_required()
def create_student():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'roll_number', 'department', 'year', 'section']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Check if email or roll_number already exists
        existing_student = Student.query.filter(
            or_(
                Student.email == data['email'],
                Student.roll_number == data['roll_number']
            )
        ).first()

        if existing_student:
            return jsonify({'error': 'Email or roll number already exists'}), 409

        student = Student(
            name=data['name'],
            email=data['email'],
            roll_number=data['roll_number'],
            department=data['department'],
            year=data['year'],
            section=data['section'],
            avatar=data.get('avatar')
        )

        db.session.add(student)
        db.session.commit()

        return jsonify(student.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@students_bp.route('/<int:student_id>', methods=['PUT'])
@jwt_required()
def update_student(student_id):
    try:
        student = Student.query.get_or_404(student_id)
        data = request.get_json()

        # Update fields if provided
        if 'name' in data:
            student.name = data['name']
        if 'email' in data:
            student.email = data['email']
        if 'roll_number' in data:
            student.roll_number = data['roll_number']
        if 'department' in data:
            student.department = data['department']
        if 'year' in data:
            student.year = data['year']
        if 'section' in data:
            student.section = data['section']
        if 'avatar' in data:
            student.avatar = data['avatar']

        db.session.commit()
        return jsonify(student.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@students_bp.route('/<int:student_id>', methods=['DELETE'])
@jwt_required()
def delete_student(student_id):
    try:
        student = Student.query.get_or_404(student_id)
        student.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Student deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
```

### 7. Attendance Routes (routes/attendance.py)
```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import AttendanceRecord, Student, Subject, User, db
from datetime import datetime, date
from sqlalchemy import func

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('', methods=['GET'])
@jwt_required()
def get_attendance():
    try:
        date_str = request.args.get('date')
        subject_id = request.args.get('subject_id', type=int)
        student_id = request.args.get('student_id', type=int)

        query = AttendanceRecord.query

        if date_str:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            query = query.filter(AttendanceRecord.date == target_date)

        if subject_id:
            query = query.filter(AttendanceRecord.subject_id == subject_id)

        if student_id:
            query = query.filter(AttendanceRecord.student_id == student_id)

        attendance_records = query.order_by(AttendanceRecord.created_at.desc()).all()

        return jsonify([record.to_dict() for record in attendance_records]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@attendance_bp.route('', methods=['POST'])
@jwt_required()
def mark_attendance():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        attendance_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        subject_id = data['subject_id']
        attendance_data = data['attendance']  # Dict of student_id: status

        # Get or create attendance records
        attendance_records = []
        for student_id, status in attendance_data.items():
            # Check if record already exists
            existing_record = AttendanceRecord.query.filter_by(
                student_id=student_id,
                subject_id=subject_id,
                date=attendance_date
            ).first()

            if existing_record:
                existing_record.status = status
                existing_record.teacher_id = user_id
                attendance_records.append(existing_record)
            else:
                new_record = AttendanceRecord(
                    student_id=student_id,
                    subject_id=subject_id,
                    teacher_id=user_id,
                    date=attendance_date,
                    status=status
                )
                db.session.add(new_record)
                attendance_records.append(new_record)

        db.session.commit()

        return jsonify({
            'message': 'Attendance marked successfully',
            'records': [record.to_dict() for record in attendance_records]
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@attendance_bp.route('/reports', methods=['GET'])
@jwt_required()
def get_attendance_reports():
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        department = request.args.get('department')
        subject_id = request.args.get('subject_id', type=int)

        query = db.session.query(
            Student.name,
            Student.roll_number,
            Subject.name.label('subject_name'),
            func.count(AttendanceRecord.id).label('total_classes'),
            func.sum(
                func.case(
                    [(AttendanceRecord.status == 'present', 1)],
                    else_=0
                )
            ).label('present_count'),
            func.sum(
                func.case(
                    [(AttendanceRecord.status == 'absent', 1)],
                    else_=0
                )
            ).label('absent_count'),
            func.sum(
                func.case(
                    [(AttendanceRecord.status == 'late', 1)],
                    else_=0
                )
            ).label('late_count')
        ).join(
            AttendanceRecord, Student.id == AttendanceRecord.student_id
        ).join(
            Subject, AttendanceRecord.subject_id == Subject.id
        )

        if start_date and end_date:
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
            end = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(AttendanceRecord.date.between(start, end))

        if department:
            query = query.filter(Student.department == department)

        if subject_id:
            query = query.filter(Subject.id == subject_id)

        reports = query.group_by(
            Student.id, Subject.id
        ).all()

        report_data = []
        for report in reports:
            attendance_percentage = (
                (report.present_count / report.total_classes) * 100
                if report.total_classes > 0 else 0
            )
            
            report_data.append({
                'student_name': report.name,
                'roll_number': report.roll_number,
                'subject': report.subject_name,
                'total_classes': report.total_classes,
                'present_count': report.present_count,
                'absent_count': report.absent_count,
                'late_count': report.late_count,
                'attendance_percentage': round(attendance_percentage, 2)
            })

        return jsonify(report_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### 8. Dashboard Routes (routes/dashboard.py)
```python
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Student, User, AttendanceRecord, Subject, db
from datetime import datetime, date, timedelta
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        today = date.today()
        
        # Basic counts
        total_students = Student.query.filter_by(is_active=True).count()
        total_teachers = User.query.filter_by(role='teacher', is_active=True).count()
        
        # Today's attendance
        today_attendance = db.session.query(
            func.count(AttendanceRecord.id).label('total'),
            func.sum(
                func.case(
                    [(AttendanceRecord.status == 'present', 1)],
                    else_=0
                )
            ).label('present')
        ).filter(AttendanceRecord.date == today).first()
        
        today_percentage = (
            (today_attendance.present / today_attendance.total) * 100
            if today_attendance.total > 0 else 0
        )
        
        # Monthly trend (last 6 months)
        monthly_data = []
        for i in range(6):
            month_start = (today.replace(day=1) - timedelta(days=i*30)).replace(day=1)
            month_end = (month_start + timedelta(days=31)).replace(day=1) - timedelta(days=1)
            
            month_attendance = db.session.query(
                func.count(AttendanceRecord.id).label('total'),
                func.sum(
                    func.case(
                        [(AttendanceRecord.status == 'present', 1)],
                        else_=0
                    )
                ).label('present')
            ).filter(
                AttendanceRecord.date.between(month_start, month_end)
            ).first()
            
            percentage = (
                (month_attendance.present / month_attendance.total) * 100
                if month_attendance.total > 0 else 0
            )
            
            monthly_data.append({
                'month': month_start.strftime('%b'),
                'percentage': round(percentage, 1)
            })
        
        monthly_data.reverse()
        
        # Average attendance
        total_attendance = db.session.query(
            func.count(AttendanceRecord.id).label('total'),
            func.sum(
                func.case(
                    [(AttendanceRecord.status == 'present', 1)],
                    else_=0
                )
            ).label('present')
        ).first()
        
        average_attendance = (
            (total_attendance.present / total_attendance.total) * 100
            if total_attendance.total > 0 else 0
        )
        
        # Recent activity
        recent_records = AttendanceRecord.query.order_by(
            AttendanceRecord.created_at.desc()
        ).limit(10).all()
        
        recent_activity = []
        for record in recent_records:
            recent_activity.append({
                'id': str(record.id),
                'type': 'attendance',
                'message': f'Attendance marked for {record.subject.name}',
                'timestamp': record.created_at.isoformat()
            })
        
        return jsonify({
            'totalStudents': total_students,
            'totalTeachers': total_teachers,
            'todayAttendance': round(today_percentage, 1),
            'averageAttendance': round(average_attendance, 1),
            'monthlyAttendance': monthly_data,
            'recentActivity': recent_activity
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### 9. Main Application (app.py)
```python
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import Config
from models import db, User, Student, Subject
from routes.auth import auth_bp
from routes.students import students_bp
from routes.attendance import attendance_bp
from routes.dashboard import dashboard_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    migrate = Migrate(app, db)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    # Create tables and sample data
    with app.app_context():
        db.create_all()
        create_sample_data()
    
    return app

def create_sample_data():
    # Create admin user
    if not User.query.filter_by(email='admin@edutrack.com').first():
        admin = User(
            name='John Admin',
            email='admin@edutrack.com',
            role='admin',
            department='Administration'
        )
        admin.set_password('admin123')
        db.session.add(admin)
    
    # Create teacher
    if not User.query.filter_by(email='teacher@edutrack.com').first():
        teacher = User(
            name='Dr. Sarah Johnson',
            email='teacher@edutrack.com',
            role='teacher',
            department='Computer Science'
        )
        teacher.set_password('teacher123')
        db.session.add(teacher)
    
    # Create sample students
    if not Student.query.first():
        students_data = [
            {
                'name': 'Alice Johnson',
                'email': 'alice@student.edu',
                'roll_number': 'CS21001',
                'department': 'Computer Science',
                'year': 3,
                'section': 'A'
            },
            {
                'name': 'Bob Smith',
                'email': 'bob@student.edu',
                'roll_number': 'CS21002',
                'department': 'Computer Science',
                'year': 3,
                'section': 'A'
            }
        ]
        
        for student_data in students_data:
            student = Student(**student_data)
            db.session.add(student)
    
    db.session.commit()

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
```

### 10. Environment Variables (.env)
```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=sqlite:///attendance.db
FLASK_ENV=development
```

## 🚀 Running the Backend

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the application:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/reports` - Get attendance reports

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🔧 Frontend Configuration

Update your frontend to connect to the Flask backend by creating a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then update your API calls to use the base URL:

```javascript
const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/students`;
```

This comprehensive Flask backend provides all the necessary endpoints for the EduTrack Attendance Management System. The backend includes authentication, student management, attendance tracking, and dashboard statistics.