var CU = require('../compilerUtils'),
	styler = require('../styler'),
	_ = require('lodash');

exports.parse = function (node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';

	// make symbol a local variable if necessary
	if (state.local) {
		args.symbol = CU.generateUniqueId();
	}

	// Generate runtime code
	code += (state.local ? 'var ' : '') + args.symbol + ' = ';
	code += styler.generateStyleParams(
		state.styles,
		args.classes,
		args.id,
		CU.getNodeFullname(node),
		_.defaults(state.extraStyle || {}, args.createArgs || {}),
		state
	) + ';\n';

	// Update the parsing state
	return {
		parent: {
			node: node,
			symbol: args.symbol
		},
		local: state.local || false,
		model: state.model || undefined,
		condition: state.condition || undefined,
		styles: state.styles,
		code: code
	};
}
