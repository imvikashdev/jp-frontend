---
# JackPass Frontend

Welcome to the **JackPass Frontend** – a React-powered event management app that lets you create, view, and manage events with media support, local persistence, and a dash of witty flair.
---

## Quick Start

- **Clone the Repo:**

  ```bash
  git clone https://github.com/imvikashdev/jp-frontend.git
  cd jackpass-frontend
  ```

- **Install Dependencies:**

  ```bash
  npm install
  # or
  yarn install
  ```

- **Run the App:**
  ```bash
  npm run dev
  # or
  yarn dev
  ```
  Visit `http://localhost:5173` (or the port specified by Vite) in your browser.

---

## Available Scripts

- **Development:**  
  `npm run dev`

- **Build:**  
  `npm run build`

- **Lint:**  
  `npm run lint`

- **Preview:**  
  `npm run preview`

---

## What We Used

- **React & React Router:**  
  For our single-page application magic.

- **Tailwind CSS & shadcn UI:**  
  For styling that makes your eyes happy (and responsive designs too).

- **React Hook Form:**  
  For making forms easy (and validating them).

- **Zustand (with persist middleware):**  
  For lightweight state management and local storage persistence (because events shouldn’t vanish into thin air).

- **react-error-boundary & @radix-ui/react-toast:**  
  For catching those pesky errors and showing toast alerts.

- **Leaflet & react-leaflet:**  
  For interactive maps.

- **Moment.js:**  
  For date formatting, because working with dates without it is a nightmare.

- **UUID:**  
  For generating unique event IDs.

---

## Key Functionalities

- **Event Creation:**  
  Create events with title, description, community, date/time, location (via map or manual entry), and media upload (image/video with proper resizing/thumbnail generation).

- **Event Listing:**  
  Browse your events in a responsive grid, with neat tabs to switch between events and communities.

- **Data Persistence:**  
  Your events are stored in the browser (via local storage) so that they persist even if you forget to save your work.

- **Error Handling:**  
  A functional error boundary catches any mishaps and displays toast notifications (because nobody likes a crashed app).

---

## Final Thoughts

This project is designed to be clean, responsive, and user-friendly. Enjoy exploring and enhancing your event management app!
