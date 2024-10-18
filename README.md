# Diego de Sousa - Personal Portfolio

This repository contains the source code for Diego de Sousa's personal portfolio website, showcasing his work as a frontend developer specializing in accessible, interactive, and fast websites.

## 🚀 Project Structure

The website is built using Astro, a modern static site generator, along with several other technologies:

- 🚀 Astro
- ⚛️ React
- 🎨 Tailwind CSS
- 📝 MDX for content
- 🌐 i18n for internationalization (Spanish, English, Portuguese, Galician)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command              | Action                                           |
| :------------------- | :----------------------------------------------- |
| `pnpm install`       | Installs dependencies                            |
| `pnpm run dev`       | Starts local dev server at `localhost:4321`      |
| `pnpm run build`     | Build your production site to `./dist/`          |
| `pnpm run preview`   | Preview your build locally, before deploying     |
| `pnpm run astro ...` | Run CLI commands like `astro add`, `astro check` |
| `pnpm run lint`      | Lint and format code                             |

## 🌟 Features

- Responsive design
- Dark mode support
- Multi-language support (ES, EN, PT, GL)
- Project showcase
- Contact form
- SEO optimized

## 📂 Project Structure

- `src/`: Source code
  - `components/`: Reusable Astro components
  - `content/`: MDX files for projects
  - `i18n/`: Internationalization files
  - `pages/`: Astro pages
  - `styles/`: Global CSS styles
- `public/`: Static assets

## 🌐 Deployment

The site is configured to be deployed, likely using a platform like Netlify or Vercel (exact deployment details not provided in the codebase).

## 🔄 Automatic Updates

This project includes an automatic update system to change the color palette and other visual elements on different seasons or dates:

- `plugins/tailwind/seasonalStylesPlugin.ts`: A plugin that changes the color palette and other visual elements on different seasons or dates.
- `update_date.sh`: A shell script that updates the last modification date and the current season.
- `.github/workflows/update.yml`: A GitHub Actions workflow that runs the update script periodically.
- `last_update.txt`: A file containing the last update information.

## 🧑‍💻 Contributing

This is a personal portfolio project, but if you find any bugs or have suggestions, feel free to open an issue.

## 📄 License

This work is licensed under a [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](http://creativecommons.org/licenses/by-nc-nd/4.0/).

This means you are free to:

- Share — copy and redistribute the material in any medium or format

Under the following terms:

- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- NonCommercial — You may not use the material for commercial purposes.
- NoDerivatives — If you remix, transform, or build upon the material, you may not distribute the modified material.
