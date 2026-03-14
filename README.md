# Resume Matcher — Resume Parsing & Job Matching

A powerful and intuitive internal tool designed to streamline the recruitment process by parsing resumes and matching them against multiple job descriptions. 

## 🚀 Features

- **Resume Parsing**: Automatically extracts candidate name, years of experience, and key skills from PDF resumes.
- **Multiple JD Matching**: Upload a resume once and match it against multiple job descriptions in one go.
- **Skills Analysis**: Get a detailed breakdown of matching and missing skills for each job description.
- **Matching Score**: Intelligent scoring system to rank candidates based on skill relevance and experience.
- **Modern UI**: Clean, responsive interface with a step-by-step workflow.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Key Libraries**:
  - `pdf-parse`: For extracting text from PDF resumes.
  - `multer`: For handling file uploads.
  - `cors`: For enabling Cross-Origin Resource Sharing.
  - `playwright`: (Integration/Automation potential)

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Zenuxcoder/Resume-Parser.git
   cd Resume-Parser
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

## 📂 Project Structure

- `index.html`: Main entry point for the frontend.
- `style.css`: Modern styling for the application.
- `script.js`: Frontend logic for file uploads and API interaction.
- `server/`:
  - `server.js`: Express application entry point.
  - `routes/`: API endpoint definitions.
  - `controllers/`: Logic for parsing and matching.
  - `utils/`: Helper functions for PDF parsing and JD analysis.
  - `skills-dictionary.json`: Data for skill extraction.


