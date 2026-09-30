export type MathButton = {
  key: string;
  icon: string;
  before: string;
  after?: string;
  title: string;
};

export type MathGroup = {
  label: string;
  buttons: MathButton[];
};

const GREEK_NAMES = [
  "alpha", "beta", "gamma", "delta", "epsilon", "theta", "lambda", "mu",
  "pi", "sigma", "phi", "omega", "Delta", "Sigma", "Omega",
] as const;

const OPERATORS = [
  ["times", "\\times"], ["div", "\\div"], ["pm", "\\pm"], ["mp", "\\mp"],
  ["cdot", "\\cdot"], ["leq", "\\leq"], ["geq", "\\geq"], ["neq", "\\neq"],
  ["approx", "\\approx"], ["equiv", "\\equiv"], ["infty", "\\infty"],
  ["partial", "\\partial"], ["nabla", "\\nabla"],
] as const;

const ARROWS = [
  ["to", "\\rightarrow"], ["gets", "\\leftarrow"], ["implies", "\\Rightarrow"],
  ["iff", "\\Leftrightarrow"], ["mapsto", "\\mapsto"],
] as const;

function symbolButton(key: string, command: string): MathButton {
  return { key, icon: command, before: `${command} `, title: key };
}

export const MATH_GROUPS = [
  {
    label: "Structures",
    buttons: [
      { key: "frac", icon: "\\tfrac{a}{b}", before: "\\frac{", after: "}{}", title: "Fraction" },
      { key: "sqrt", icon: "\\sqrt{x}", before: "\\sqrt{", after: "}", title: "Square root" },
      { key: "nroot", icon: "\\sqrt[n]{x}", before: "\\sqrt[", after: "]{}", title: "Nth root" },
      { key: "sup", icon: "x^{2}", before: "^{", after: "}", title: "Superscript" },
      { key: "sub", icon: "x_{n}", before: "_{", after: "}", title: "Subscript" },
      { key: "sum", icon: "\\sum_{i}^{n}", before: "\\sum_{", after: "}^{}", title: "Sum" },
      { key: "int", icon: "\\int_{a}^{b}", before: "\\int_{", after: "}^{}", title: "Integral" },
      { key: "prod", icon: "\\prod_{i}^{n}", before: "\\prod_{", after: "}^{}", title: "Product" },
      { key: "lim", icon: "\\lim_{x\\to 0}", before: "\\lim_{x \\to ", after: "}", title: "Limit" },
    ],
  },
  {
    label: "Greek",
    buttons: GREEK_NAMES.map((name) => symbolButton(name, `\\${name}`)),
  },
  {
    label: "Operators",
    buttons: OPERATORS.map(([key, command]) => symbolButton(key, command)),
  },
  {
    label: "Arrows",
    buttons: ARROWS.map(([key, command]) => symbolButton(key, command)),
  },
  {
    label: "Brackets",
    buttons: [
      { key: "parens", icon: "(x)", before: "\\left(", after: "\\right)", title: "Parentheses" },
      {
        key: "brackets",
        icon: "[x]",
        before: "\\left[",
        after: "\\right]",
        title: "Square brackets",
      },
      { key: "bars", icon: "|x|", before: "\\left|", after: "\\right|", title: "Absolute value" },
      {
        key: "matrix",
        icon: "\\left(\\begin{smallmatrix}a&b\\\\c&d\\end{smallmatrix}\\right)",
        before: "\\begin{pmatrix}\n  a & b \\\\\n  c & d\n\\end{pmatrix}",
        title: "Matrix",
      },
      {
        key: "cases",
        icon: "\\begin{cases}a\\\\b\\end{cases}",
        before: "\\begin{cases}\n  & \\text{if } \\\\\n  & \\text{otherwise}\n\\end{cases}",
        title: "Piecewise",
      },
    ],
  },
  {
    label: "Accents",
    buttons: [
      { key: "hat", icon: "\\hat{a}", before: "\\hat{", after: "}", title: "Hat" },
      { key: "bar", icon: "\\bar{a}", before: "\\bar{", after: "}", title: "Bar" },
      { key: "vec", icon: "\\vec{a}", before: "\\vec{", after: "}", title: "Vector" },
      { key: "dot", icon: "\\dot{a}", before: "\\dot{", after: "}", title: "Dot" },
      { key: "tilde", icon: "\\tilde{a}", before: "\\tilde{", after: "}", title: "Tilde" },
    ],
  },
] as const satisfies readonly MathGroup[];
