# Family Tree Application

A modern web application for managing and visualizing your family tree. Built with React, this application allows you to add family members, view their details, and see their locations on a map.

## Features

- Add family members with name, age, location, and relationship
- View family members in a clean, card-based interface
- Delete family members
- View family member locations on an interactive map
- Real-time notifications for actions
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Mapbox API key (for map functionality)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd family-tree-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Mapbox access token:
```
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. Navigate to the "Add Member" page to add new family members
2. View all family members on the home page
3. Click on the map icon to see family member locations
4. Click on markers on the map to view member details
5. Use the delete button to remove family members

## Technologies Used

- React
- React Router
- Styled Components
- React Map GL
- React Icons
- React Toastify

## License

MIT 