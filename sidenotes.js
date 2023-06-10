import { visit } from "unist-util-visit";

const generateHTML = (id, content) => {
  return [
    {
      type: "sidenoteLabel",
      data: {
        hName: "label",
        hProperties: {
          for: id,
          className: ["margin-toggle", "sidenote-number"],
        },
      },
    },
    {
      type: "sidenoteToggle",
      data: {
        hName: "input",
        hProperties: {
          type: "checkbox",
          id: id,
          className: ["margin-toggle"],
        },
      },
    },
    {
      type: "sidenote",
      data: {
        hName: "span",
        hProperties: { className: ["sidenote"] },
        hChildren: content,
      },
    },
  ];
};

const sidenotes = () => {
  return (tree) => {
    const footnotes = new Map();

    // Extract footnote content
    visit(tree, "footnoteDefinition", (node, index, parent) => {
      footnotes.set(node.identifier, node.children);
      parent.children.splice(index, 1);
    });

    // Replace footnote references with sidenotes
    visit(tree, "footnoteReference", (node, index, parent) => {
      // This is an array (children of the footnote content node)!
      // TODO: Is this what I want??
      const content = footnotes.get(node.identifier)[0].children;

      const id = `sidenote-${node.identifier}`;

      parent.children.splice(index, 1, ...generateHTML(id, content));
    });
  };
};

export default sidenotes;
