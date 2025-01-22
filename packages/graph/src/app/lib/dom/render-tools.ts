import {
  CONTROLS,
  type ControlInterface,
  DATA_CONTROLS,
  FORCES_CONTROLS,
  FORCES_USELESS_CONTROLS,
} from "./constants";

export function renderTools() {
  const fragment = `
    <fieldset id="${CONTROLS.Data}" style="position: absolute; z-index: 2; user-select: none; top: 20px; right: 400px">
      <legend>Select the data source:</legend>
      ${renderControls(DATA_CONTROLS)}
    </fieldset>
     <fieldset id="${CONTROLS.ForceUseless}" style="position: absolute; z-index: 2; user-select: none; top: 20px; right: 190px">
      <legend>Change the useless forces:</legend>
      ${renderControls(FORCES_USELESS_CONTROLS)}
    </fieldset>
     <fieldset id="${CONTROLS.Force}" style="position: absolute; z-index: 2; user-select: none; top: 20px; right: 20px">
      <legend>Change the forces:</legend>
      ${renderControls(FORCES_CONTROLS)}
    </fieldset>
  `;

  document.body.insertAdjacentHTML("afterbegin", fragment);
}

function renderControls(controls: ControlInterface[]) {
  return controls
    .map((control) => {
      if (control.type === "radio")
        return `
        <div>
          <input style="margin: 0.4rem" type="radio" id="${control.id}" value="d3" checked name="mock" />
          <label for="${control.id}">${control.label}</label>
        </div>
        `;
      if (control.type === "checkbox")
        return `
       <div>
          <input type="checkbox" id="${control.id}" />
          <label for="${control.id}">${control.label}</label>
        </div>
      `;
      if (control.type === "range")
        return `
       <div style="display: flex; flex-direction: column">
          <label>${control.label}</label>
          <input type="range" id="${control.id}" min="${control.min}" max="${control.max}" step="${control.step}" />
        </div>
      `;

      return "";
    })
    .join("\n");
}
