import { visit, SKIP } from "unist-util-visit";

const generateHTML = (id, long, children) => {
  let label = {
    type: "sidenoteLabel",
    data: {
      hName: "label",
      hProperties: {
        for: id,
        className: ["margin-toggle", "sidenote-number"],
      },
    },
  }

  if (long) {
    label.data.hProperties.className.push("sidenote-long")
  }

  return [
    label,
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
      },
      children: children,
    },
  ];
};

const sidenotes = () => {
  return (tree) => {
    const footnotes = new Map();

    // Extract footnote content
    visit(tree, "footnoteDefinition", (node, index, parent) => {
      footnotes.set(node.identifier, node.children);

      // Remove this node so remark-rehype doesn't generate footnotes
      parent.children.splice(index, 1);

      // This means we need to visit the same index again
      return index;
    });

    // Replace footnote references with sidenotes
    visit(tree, "footnoteReference", (node, index, parent) => {
      // Assume content is type `paragraph`
      const children = footnotes.get(node.identifier)[0].children;
      const id = `sidenote-${node.identifier}`;
      const long = node.identifier >= 10;

      // Turn the footnote reference node into a sidenote
      parent.children.splice(index, 1, ...generateHTML(id, long, children));

      // We've replaced this node so we should skip visiting its descendants
      return SKIP;
    });
  };
};

export default sidenotes;
