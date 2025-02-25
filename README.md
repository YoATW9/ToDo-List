# Todo List Application

A modern, responsive todo list application built with React and Material-UI, featuring bilingual support (English and Traditional Chinese).

## Features

- **Bilingual Support**
  - English and Traditional Chinese (繁體中文) interface
  - Language preference is saved automatically
  - Complete translations for all UI elements

- **Task Management**
  - Create, edit, and delete tasks
  - Set task priority (Low, Medium, High)
  - Add due dates and times
  - Categorize tasks (Personal, Work, Shopping, etc.)
  - Track task status (Todo, In Progress, Blocked, Completed)

- **Views**
  - Monthly calendar view
  - Daily list view
  - Upcoming tasks view
  - Notifications for due tasks
  - Progress tracking and statistics

- **Data Persistence**
  - Local storage for tasks and preferences
  - Automatic saving of changes
  - Persistent language settings

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-list
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
PORT=3001 npm start
```

The application will be available at `http://localhost:3001`

## Project Structure

```
todo-list/
├── src/
│   ├── components/         # React components
│   ├── contexts/          # React contexts (Language, Theme)
│   ├── constants/         # Constants and configurations
│   ├── utils/            # Utility functions
│   ├── App.js            # Main application component
│   └── index.js          # Application entry point
├── public/               # Static files
└── package.json          # Project dependencies and scripts
```

## Key Technologies

- React
- Material-UI (MUI)
- date-fns
- react-toastify
- Local Storage API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
