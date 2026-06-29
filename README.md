<<<<<<< HEAD
# SMRTTECH 3CC3 Lab Manual Prototype

This prototype converts the two uploaded PDF manuals into one redesigned **Lab 1: LabVIEW, Tinkercad and Arduino Sensor Interfaces** and places it within a small course website.

## Open the prototype

- Course hub: `index.html`
- Lab 1: `labs/lab-01/index.html`
- Knowledge repository: `knowledge/index.html`

The site uses only local HTML, CSS, JavaScript, and images. It does not require Tailwind, Google Fonts, highlight.js, or another CDN.

## Proposed server architecture

```text
/
├── index.html                         # Course/lab hub
├── labs/
│   └── lab-01/
│       └── index.html                 # Lab-specific manual
├── knowledge/
│   └── index.html                     # Shared knowledge repository
└── assets/
    ├── css/site.css                   # Shared design system
    ├── js/lab-01.js                   # Lab interactions and local persistence
    └── images/                        # Course-owned instructional figures
```

For a larger implementation, each knowledge topic can later become its own route, for example `/knowledge/multimeter/`, without changing the lab-page design.

## Additional knowledge-repository concepts found in the PDFs

The initial list was strong, but the PDFs also require or imply the following reusable topics:

1. LabVIEW front panel versus block diagram
2. Controls versus indicators
3. VI versus SubVI
4. LabVIEW data types
5. Arrays and clusters
6. For loops and shift registers, in addition to while loops
7. DC circuit and series-circuit fundamentals
8. Breadboard internal connections, coordinate system, and power rails
9. Resistor values, units, and resistor tolerance
10. LED polarity and the purpose of a current-limiting resistor
11. Arduino Uno pin map, 5 V, GND, A0, and D7
12. Common ground and voltage reference
13. Arduino `setup()`, `loop()`, variables, `pinMode()`, `analogRead()`, `digitalWrite()`, and `if/else`
14. Analog-to-digital conversion and the expected `analogRead()` range
15. Threshold selection and sensor calibration
16. Correct multimeter connection: resistance versus voltage mode
17. Safe resistance measurement on an unpowered physical circuit
18. Calculated versus measured values and percent difference
19. Measurement uncertainty and component/sensor variability
20. A systematic circuit-troubleshooting sequence
21. Data tables, units, significant figures, and evidence recording
22. Tinkercad simulation limitations compared with physical hardware
23. Submission identity requirements and instructor demonstration evidence

## ILO coverage

The redesigned page retains every explicit objective from both manuals:

- LabVIEW graphical programming fundamentals
- Controls, indicators, VI, and SubVI
- Data types, arrays, and clusters
- While loops, for loops, and shift registers
- LabVIEW voltage-divider VI
- Photoresistor resistance measurement
- Voltage-divider sensor interface
- Arduino analog input and digital output
- Threshold-based automatic-lighting code
- Real-circuit construction and calculated/measured comparison

The original LabVIEW exercise only directly applied the while loop and numeric controls/indicator. The redesign therefore adds formative transfer questions for SubVIs, arrays, clusters, for loops, and shift registers without adding unapproved graded deliverables.

## Pedagogical structure

Each practical stage follows:

1. **Predict** – commit to an expected relationship or output.
2. **Build** – create the software or circuit.
3. **Observe** – collect measurements or output behaviour.
4. **Explain** – connect evidence to the governing concept.
5. **Verify** – calculate, compare, and troubleshoot.

The formative checks allow unlimited retries and do not lock navigation. The lab remains a manual, not a high-stakes grading system.

## UDL and accessibility features

- Multiple representations: diagrams, equations, code, text-only wiring maps, and tables
- Multiple ways to engage: guiding question, prediction, optional transfer challenges, and just-in-time links
- Multiple ways to express reasoning: selections, written explanations, measurements, software files, and demonstrations
- Semantic headings, labels, fieldsets, tables, alt text, keyboard-operable tabs, visible focus, skip link, reduced-motion support, responsive layout, large-text controls, and print mode
- No meaning conveyed through colour alone
- Student entries remain local to the browser

This is a strong accessible starting point, not a claim of automatic WCAG/AODA conformance. It should still undergo keyboard, screen-reader, zoom, colour-contrast, mobile, and student usability testing.

## Instructor configuration required

The PDFs did not expose the actual course-specific URLs for these resources, so the prototype marks them as `Configure`:

- LabVIEW installation guide on Avenue
- Tinkercad class link
- MacVideo tutorial link
- Lab 1 quiz on Avenue

In `labs/lab-01/index.html`, search for `data-placeholder-link` and replace each placeholder `href="#"` with the approved school URL. After replacing a link, remove the `data-placeholder-link` attribute and the `Configure` badge.

## Technical notes

- Answers and measurements use browser `localStorage`; they are not sent to a server.
- The JavaScript is intentionally framework-free so it can be audited and hosted privately.
- A future LMS integration should use an institution-approved method such as LTI rather than posting grades directly from client-side JavaScript.
=======
# cloudlab1proto
first prototype for lab1 in sensor course
>>>>>>> fe03aa9570efbce5cf6c58b3b0579d2d343f8ed1
