/**
 * @type import("eslint").Rule.RuleModule
 */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      // This is the print width minus 3 (the length of ` * `) and the offset.
      description: 'Enforce Prettier formatting on comments',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {},
  },

  create(context) {
    const prettierOptions = {
      printWidth: 80,
      ...prettier.resolveConfig.sync(context.getPhysicalFilename()),
      parser: 'markdown',
    };
    for (const comment of context.getSourceCode().getAllComments()) {
      switch (comment.type) {
        case 'Block': {
          const offset = comment.loc.start.column;
          const value = cleanupBlockComment(comment.value);
          const formattedValue = format(value, offset, prettierOptions);
          if (formattedValue !== value) {
            context.report({
              node: comment,
              message2: `Comment is not formatted correctly.`,
              message: `Comment is not formatted correctly.`,
              fix(fixer) {
                return fixer.replaceText(
                  comment,
                  buildBlockComment(formattedValue, offset).trimStart()
                );
              },
            });
          }
          break;
        }
      }
    }
    return {};
  },
};

module.exports = {
  rules: {
    'prettier-6': rule,
  },
};
