# WebP Convert

A modern, fast, and sleek web application built to instantly convert JPG and PNG images into the highly optimized WebP format. This project is built using the latest web technologies to provide a premium user experience with real-time feedback, smooth animations, and secure server-side image processing.

## 🚀 Features

- **Instant Conversion**: Convert your `.jpg`, `.jpeg`, and `.png` images to `.webp` effortlessly.
- **Premium UI/UX**: Built with modern design principles featuring glassmorphism, animated background effects, smooth transitions, and responsive grid layouts.
- **Client-Side Validation**: Ensures uploaded files are of the correct format and do not exceed the 10MB limit.
- **Visual Feedback**: Real-time progress bar, simulated upload states, and animated status alerts (success/error).
- **Auto-Download**: Automatically triggers the download of the converted WebP image once processing is complete.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (Node.js backend)
- **Package Manager**: [Bun](https://bun.sh/)

## 📂 Project Structure

- `app/page.tsx`: The main user interface containing the drag-and-drop upload form and animations.
- `app/api/convert/route.ts`: The backend API endpoint that securely handles the image upload and uses `sharp` to convert the file to WebP format.
- `components/ui/`: Reusable UI components from shadcn (e.g., Button, Card, Badge, Progress, Alert).

## 💻 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd image-convert
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Running the Development Server

Start the local development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

### Building for Production

To create an optimized production build:

```bash
bun run build
```

To start the production server:

```bash
bun run start
```

## 🎨 Design Philosophy

The application interface is designed to wow the user. It moves away from generic defaults by utilizing:
- **Dark Mode Elegance**: A deep slate and violet palette (`slate-950` to `slate-900`) combined with subtle glow effects.
- **Micro-Animations**: Hover states, loading spinners, pulsating icons, and smooth layout transitions keep the app feeling alive and responsive.
- **Clear Typography**: Crisp, modern sans-serif fonts combined with gradient text fills for headers.