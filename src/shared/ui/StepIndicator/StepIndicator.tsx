import clsx from 'clsx';
import styles from './stepindicator.module.css';

interface StepIndicatorProps {
  currentStep: number;
  totalStep: number;
}

export const StepIndicator = ({
  currentStep,
  totalStep,
}: StepIndicatorProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>
        Шаг {currentStep} из {totalStep}
      </p>

      <div className={styles.progress}>
        {Array.from({ length: totalStep }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              styles.line,
              index < currentStep ? styles.active : styles.inactive
            )}
          />
        ))}
      </div>
    </div>
  );
};
