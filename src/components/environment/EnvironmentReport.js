import classNames from 'classnames';
import styles from './EnvironmentReport.module.scss';

const EnvironmentReport = () => {
  return (
    <section
      className={classNames(
        'container d-flex flex-lg-row flex-column',
        styles['environment-report']
      )}
    >
      <div
        className={classNames(
          'col-12 col-lg-6 pe-lg-2',
          'd-flex flex-column align-items-start justify-content-center',
          styles['environment-report__main']
        )}
      >
        <h2 className="mb-5">{environment.report.title}</h2>
        <div
          className={classNames(
            'd-block d-lg-none col-12 mb-5',
            styles['environment-report__img-xs']
          )}
        ></div>
        <p className="subdued mb-6">{environment.report.description - part - 1}</p>
        <p className="subdued mb-0">{environment.report.description - part - 2}</p>
      </div>
      <div
        className={classNames(
          'd-none d-lg-block col-12 col-md-6',
          styles['environment-report__img-lg']
        )}
      ></div>
    </section>
  );
};

export default EnvironmentReport;
