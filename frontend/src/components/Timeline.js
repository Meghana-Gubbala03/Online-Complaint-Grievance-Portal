import React from "react";
import "./Timeline.css";

/**
 * Timeline component to display complaint status.
 * 
 * Props:
 * - status: Current status string (one of "new", "under review", "resolved", "escalated")
 */

const statusMap = {
  new: "completed",
  "under review": "under-review",
  resolved: "resolved",
  escalated: "escalated",
};

const Timeline = ({ status }) => {
  // Define the steps in order
  const steps = ["New", "Under Review", "Resolved", "Escalated"];

  // Determine the index of current status
  const currentIndex = steps.findIndex(
    (step) => step.toLowerCase() === status.toLowerCase()
  );

  return (
    <div className="timeline-container">
      {steps.map((step, index) => {
        let stepClass = "";

        // Assign the correct class based on current status
        if (index < currentIndex) {
          stepClass = "completed";
        } else if (index === currentIndex) {
          stepClass = statusMap[status.toLowerCase()];
        }

        return (
          <div key={index} className="timeline-step">
            <div className={`timeline-circle ${stepClass}`}>{index + 1}</div>
            <div className={`timeline-content ${stepClass ? `${stepClass}-text` : ""}`}>
              <h4>{step}</h4>
            </div>
            {index !== steps.length - 1 && (
              <div className={`timeline-bar ${index < currentIndex ? "completed" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
