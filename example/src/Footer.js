import React from 'react'

const repoName = 'nerdstep/react-coordinate-input'
const repoUrl = `https://github.com/${repoName}`
const repoImg = 'https://flat.badgen.net/badge//github?icon=github'
const forksImg = `https://flat.badgen.net/github/forks/${repoName}`
const starsImg = `https://flat.badgen.net/github/stars/${repoName}`

const Footer = () => (
  <nav
    className="breadcrumb has-bullet-separator is-centered"
    aria-label="breadcrumbs"
  >
    <ul>
      <li style={{ height: 24 }}>
        <a href={repoUrl}>
          <img src={repoImg} alt="GitHub" style={{ height: 20 }} />
        </a>
      </li>
      <li>
        <a href={repoUrl}>
          <img src={forksImg} alt="GitHub forks" />
        </a>
      </li>
      <li>
        <a href={repoUrl}>
          <img src={starsImg} alt="GitHub stars" />
        </a>
      </li>
    </ul>
  </nav>
)

export default Footer
