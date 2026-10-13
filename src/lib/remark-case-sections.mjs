/** Materialize component headings into MDX's normal heading tree for the content collection. */
export default function remarkCaseSections() {
  return (tree) => {
    function walk(node) {
      if (node.type === 'mdxJsxFlowElement' && node.name === 'CaseSection') {
        const attributes = Object.fromEntries((node.attributes || [])
          .filter((attribute) => attribute.type === 'mdxJsxAttribute')
          .map((attribute) => [attribute.name, attribute.value]));
        if (typeof attributes.id !== 'string' || typeof attributes.title !== 'string') {
          throw new Error('CaseSection requires literal stable id and title attributes.');
        }
        node.children.unshift({
          type: 'heading', depth: 2,
          data: { hProperties: { id: attributes.id } },
          children: [{ type: 'text', value: attributes.title }],
        });
      }
      for (const child of node.children || []) walk(child);
    }
    walk(tree);
  };
}
