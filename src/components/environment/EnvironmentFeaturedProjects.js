import React from 'react';
import Link from 'next/link';
import styles from './EnvironmentFeaturedProjects.module.scss';

const EnvironmentFeaturedProjects = ({ projects }) => {
  return (
    <section className={styles.featured}>
      <div className="container">
        <div className="row">
          {projects.map((project, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className={styles.project}>
                {project.image && (
                  <img src={project.image} alt={project.title} className={styles.image} />
                )}
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.links && project.links.map((link, linkIndex) => (
                  <Link key={linkIndex} href={link.url} className={styles.button}>
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnvironmentFeaturedProjects;
