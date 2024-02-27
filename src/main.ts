const DAYS = [
  ["SU", "Sunday"],
  ["MO", "Monday"],
  ["TU", "Tuesday"],
  ["WE", "Wednesday"],
  ["TH", "Thursday"],
  ["FR", "Friday"],
  ["SA", "Saturday"],
] as const;

const BYDAY = [
  ...DAYS,
  ["MO,TU,WE,TH,FR,SU,SA", "Day"],
  ["MO,TU,WE,TH,FR", "Weekday"],
  ["SU,SA", "Weekend day"],
] as const;

const BYMONTH = [
  [1, "Jan"],
  [2, "Feb"],
  [3, "Mar"],
  [4, "Apr"],
  [5, "May"],
  [6, "Jun"],
  [7, "Jul"],
  [8, "Aug"],
  [9, "Sep"],
  [10, "Oct"],
  [11, "Nov"],
  [12, "Dec"],
] as const;

const BYSETPOS = [
  [1, "First"],
  [2, "Second"],
  [3, "Third"],
  [4, "Forth"],
  [-1, "Last"],
] as const;

const BYMONTHDAY = Array.from({ length: 31 }, (_, i) => i + 1);

const enum KEY {
  FREQ = "FREQ",
  BYMONTH = "BYMONTH",
  BYMONTHDAY = "BYMONTHDAY",
  BYSETPOS = "BYSETPOS",
  BYDAY = "BYDAY",
  INTERVAL = "INTERVAL",
}

/** FREQUENCY DYNAMIC FORM */
(() => {
  type TOptions = (typeof OPTIONS)[number];

  const OPTIONS = ["YEARLY", "MONTHLY", "WEEKLY", "DAILY", "HOURLY"] as const;
  const ELEMENTS = new Map<TOptions, Element[]>();

  ELEMENTS.set("YEARLY", [createYearlyFormComponent()]);
  ELEMENTS.set("MONTHLY", [
    createIntervalComponent("month"),
    createMonthlyFormComponent(),
  ]);
  ELEMENTS.set("WEEKLY", [
    createIntervalComponent("week"),
    createDayOfWeekComponent(),
  ]);
  ELEMENTS.set("DAILY", [createIntervalComponent("day")]);
  ELEMENTS.set("HOURLY", [createIntervalComponent("hour")]);

  const select = document.querySelector<HTMLSelectElement>("#frequency")!;
  const container = document.querySelector<HTMLDivElement>("#freq-container")!;

  /** Insert options from data */

  select.name = KEY.FREQ;
  select.append(
    ...createElementsFromString(
      createHTMLString(
        [...OPTIONS],
        (key) => /*html*/ `<option value="${key}">${key}</option>`
      )
    )
  );

  select.addEventListener("change", (e) => {
    /**remove elements from the container up to my select component */
    while (!container.lastElementChild?.contains(select))
      container.removeChild(container.lastElementChild as Node);

    const { value } = e.currentTarget as HTMLSelectElement;

    /**append elements from dictionary depending on selected option */
    container.append(...(ELEMENTS.get(value as TOptions) ?? ""));
  });

  container.append(...(ELEMENTS.get(select.value as TOptions) ?? ""));
})();

(() => {
  type TOptions = (typeof OPTIONS)[number];

  const OPTIONS = ["Never", "After", "On date"] as const;
  const ELEMENTS = new Map<TOptions, Element[]>();

  ELEMENTS.set(
    "After",
    createElementsFromString(/*html */ `
      <div>hui</div>
    `)
  );

  ELEMENTS.set("Never", []);

  ELEMENTS.set(
    "On date",
    createElementsFromString(/*html */ `
      <div>pizda</div>
    `)
  );

  const select = document.querySelector<HTMLSelectElement>("#end")!;
  const container = document.querySelector<HTMLDivElement>("#end-container")!;

  select.append(
    ...createElementsFromString(
      createHTMLString(
        [...OPTIONS],
        (key) => /*html*/ `<option value="${key}">${key}</option>`
      )
    )
  );

  select.addEventListener("change", (e) => {
    while (!container.lastElementChild?.contains(select))
      container.removeChild(container.lastElementChild as Node);

    const { value } = e.currentTarget as HTMLSelectElement;

    container.append(...(ELEMENTS.get(value as TOptions) ?? ""));
  });

  container.append(...(ELEMENTS.get(select.value as TOptions) ?? ""));
})();

/** DATA AGGREGATION */

const form = document.querySelector<HTMLFormElement>("#sample-form")!;

form.addEventListener("change", formChangeHandler);

function formChangeHandler(e: Event) {
  console.log(e);

  const formdata = new FormData(e.currentTarget as HTMLFormElement);

  console.log([...formdata]);
}

/**UTILS */

function createElementsFromString(html: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  return Array.from(document.body.children);
}

function createHTMLString<T>(array: T[], fn: (value: T) => string) {
  return array.reduce((str, v) => str + fn(v), "");
}

/**COMPONENTS */

function createIntervalComponent(every: string) {
  const [component] = createElementsFromString(/*html */ `
    <div class="col-4 form-group d-flex align-items-center">
      <span class="mr-2">every</span>
      <input class="form-control px-1" 
        type="number" 
        name="${KEY.INTERVAL}"
        value="${1}"
        defaultValue="${1}"
        min="${1}"/>
      <span class="ml-2">${every}(s)</span>
    </div>`);

  component.addEventListener("input", (e) => {
    const target = <HTMLInputElement>e.target;
    if (!target.value) {
      target.value = "1";
    }
  });

  return component;
}

function createDayOfWeekComponent() {
  const [component] = createElementsFromString(/*html */ `
    <div class="col-8">
      <div class="btn-group btn-group-toggle w-100">
        ${createHTMLString(
          [...DAYS],
          ([key]) => /*html */ `
            <label class="btn btn-secondary">
                <input type="checkbox" name="${KEY.BYDAY}" value="${key}"> ${key}
            </label>
          `
        )}
      </div>
    </div>`);

  component.addEventListener("change", (e) => {
    const el = <HTMLInputElement>e.target;
    el.parentElement?.classList.toggle("active", el.checked);
  });

  return component;
}

function createMonthlyFormComponent() {
  const caseId1 = "monthly-case-1";
  const caseId2 = "monthly-case-2";

  const [component] = createElementsFromString(/*html */ `
    <div class="col-12">
      <div class="row align-items-center mb-2" data-block>
        <div class="col-2">
          <div class="form-check">
            <input class="form-check-input" 
              type="radio" 
              id="${caseId1}" 
              data-case>
            <label class="form-check-label" for="${caseId1}">on day</label>
          </div>
        </div>
        <div class="col-4">
          <select class="custom-select" name="${KEY.BYMONTHDAY}">
            ${createHTMLString(
              BYMONTHDAY,
              (n) => /*html */ `<option value="${n}">${n}</option>`
            )}
          </select>
        </div>
      </div>

      <div class="row align-items-center" data-block>
        <div class="col-2">
          <div class="form-check">
            <input class="form-check-input" 
              type="radio" 
              id="${caseId2}" 
              data-case>
            <label class="form-check-label" for="${caseId2}">on the</label>
          </div>
        </div>
        <div class="col-4">
          <select class="custom-select" name="${KEY.BYSETPOS}">
            ${createHTMLString(
              [...BYSETPOS],
              ([value, key]) =>
                /*html */ `<option value="${value}">${key}</option>`
            )}
          </select>
        </div>
        <div class="col-2">
          <select class="custom-select" name="${KEY.BYDAY}">
            ${createHTMLString(
              [...BYDAY],
              ([value, key]) =>
                /*html */ `<option value="${value}">${key}</option>`
            )}
          </select>
        </div>
      </div>
    </div>
  `);

  const radios = Array.from(
    component.querySelectorAll<HTMLInputElement>("[data-case]")
  );
  const controls = Array.from(
    component.querySelectorAll<HTMLSelectElement>("[name]")
  );

  component.addEventListener("change", (e) => {
    const target = <HTMLElement>e.target;

    if (radios.some((el) => el === target)) {
      radios.forEach((el) => {
        el.checked = el === target;
      });

      controls.forEach((el) => {
        el.disabled = !el.closest("[data-block]")!.contains(target);
      });
    }
  });

  // dispatch event on first render;
  radios.find((_) => true)!.click();

  return component;
}

function createYearlyFormComponent() {
  const caseId1 = "yearly-case-1";
  const caseId2 = "yearly-case-2";

  const [component] = createElementsFromString(/*html */ `
  <div class="col-12">
    <div class="row align-items-center mb-2" data-block>
      <div class="col-2">
        <div class="form-check">
          <input class="form-check-input" 
            type="radio" 
            id="${caseId1}" 
            data-case>
          <label class="form-check-label" for="${caseId1}">on day</label>
        </div>
      </div>
      <div class="col-4">
        <select class="custom-select" name="${KEY.BYMONTH}">
          ${createHTMLString(
            [...BYMONTH],
            ([value, key]) =>
              /*html */ `<option value="${value}">${key}</option>`
          )}
        </select>
      </div>

      <div class="col-2">
        <select class="custom-select" name="${KEY.BYMONTHDAY}">
          ${createHTMLString(
            BYMONTHDAY,
            (n) => /*html */ `<option value="${n}">${n}</option>`
          )}
        </select>
      </div>
    </div>

    <div class="row align-items-center" data-block>
      <div class="col-2">
        <div class="form-check">
          <input class="form-check-input" 
            type="radio" 
            id="${caseId2}" 
            data-case>
          <label class="form-check-label" for="${caseId2}">on the</label>
        </div>
      </div>
      <div class="col-4">
        <select class="custom-select" name="${KEY.BYSETPOS}">
          ${createHTMLString(
            [...BYSETPOS],
            ([value, key]) =>
              /*html */ `<option value="${value}">${key}</option>`
          )}
        </select>
      </div>
      <div class="col-2">
        <select class="custom-select" name="${KEY.BYDAY}">
          ${createHTMLString(
            [...BYDAY],
            ([value, key]) =>
              /*html */ `<option value="${value}">${key}</option>`
          )}
        </select>
      </div>
      <span>of</span>
      <div class="col-2">
        <select class="custom-select" name="${KEY.BYMONTH}">
          ${createHTMLString(
            [...BYMONTH],
            ([value, key]) =>
              /*html */ `<option value="${value}">${key}</option>`
          )}
        </select>
      </div>
    </div>
  </div>
  `);

  const radios = Array.from(
    component.querySelectorAll<HTMLInputElement>("[data-case]")
  );
  const controls = Array.from(
    component.querySelectorAll<HTMLSelectElement>("[name]")
  );

  component.addEventListener("change", (e) => {
    const target = <HTMLInputElement>e.target;

    if (radios.some((el) => el === target)) {
      radios.forEach((el) => {
        el.checked = el === target;
      });

      controls.forEach((el) => {
        el.disabled = !el.closest("[data-block]")!.contains(target);
      });
    }
  });

  // dispatch event on first render;
  radios.find((_) => true)!.click();

  return component;
}
