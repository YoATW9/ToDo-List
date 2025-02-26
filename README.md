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
  - Manage categories through a dedicated interface
  - Track task status (Todo, In Progress, Blocked, Completed)
  - Smart category management with task reassignment

- **Views**
  - Interactive monthly calendar view with correct date display
  - Daily list view with filtering and sorting
  - Upcoming tasks view with priority indicators
  - Category-based filtering and search
  - Progress tracking and statistics

- **Data Persistence**
  - Local storage for tasks, categories, and preferences
  - Automatic saving of all changes
  - Persistent language and category settings
  - Safe category deletion with task reassignment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YoATW9/ToDo-List.git
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
