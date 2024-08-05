import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PANTRY TRACKER",
  description: "INVENTORY APP FOR EVERYTHING",
};


// This is a Next.js layout component.
// It is a reusable template for the HTML structure of our web pages.
// The layout is defined using JSX (JavaScript XML) syntax.

// The component is a function that takes a single prop: "children".
// "children" is a special prop that is automatically passed to every component in Next.js.
// It contains the content that should be rendered inside the layout.

// The function returns a JSX element that represents the HTML structure of the page.
// The outermost element is the "html" tag, which is the root element of an HTML document.
// It has a "lang" attribute that sets the language of the page.
// The "children" prop is rendered inside the "body" tag.

export default function RootLayout({ children }) {
  // The function body is wrapped in curly braces, which means it's a concise way to define a function with a single statement.
  // The statement is the return statement, which returns the JSX element.

  return (
    // The JSX element is wrapped in parentheses, which means it's an expression.
    // The expression evaluates to the JSX element.
    // The JSX element is an HTML-like syntax that is transpiled to JavaScript by Babel.
    // The HTML-like syntax allows us to write HTML-like code in JavaScript.

    // The outermost element is the "html" tag.
    // The "html" tag represents the root element of an HTML document.
    // It has a "lang" attribute that sets the language of the page.
    // The value of the "lang" attribute is "en", which represents English.
    // It also has a "className" attribute that sets the CSS class of the element.
    // The value of the "className" attribute is the result of calling the "className" property of the "inter" object.
    // The "inter" object is an instance of the "Inter" font class, which is imported from the "next/font/google" module.
    // The "Inter" font is a custom Google Font that we imported in the "globals.css" file.

    <html lang="en">
      {/* The "body" tag represents the body of an HTML document. */}
      {/* It has a "className" attribute that sets the CSS class of the element. */}
      {/* The value of the "className" attribute is the result of calling the "className" property of the "inter" object. */}
      {/* The "children" prop is rendered inside the "body" tag. */}
      {/* The "children" prop contains the content that should be rendered inside the layout. */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
