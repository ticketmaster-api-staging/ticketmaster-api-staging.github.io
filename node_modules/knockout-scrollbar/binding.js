
var ResizeSensor = require('css-element-queries/src/ResizeSensor')
var Ps = require('perfect-scrollbar')
var ko = require('knockout')

function getOpts(acc) {
    var opts = ko.unwrap(acc())
    if (opts.x === undefined) opts.x = true
    if (opts.y === undefined) opts.y = true
    return opts
}

function psOpts(opts) {
    return {
        suppressScrollX: !opts.x,
        suppressScrollY: !opts.y,
    }
}

var scrollBinding = {
    init: function (element, valAcc, bindings, vm, ctx) {
        var opts = getOpts(valAcc)
        Ps.initialize(element, psOpts(opts))
        var sensor = new ResizeSensor(element, function () {
            Ps.update(element)
        })
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            sensor.detach()
            Ps.destroy(element)
        })
    },
    update: function (element, valAcc, bindings, vm, ctx) {
        var opts = getOpts(valAcc)
        if (ctx._firstUpdateComplete) {
            Ps.destroy(element)
            ko.bindingHandlers.scroll.init.apply(this, arguments);
        }
        Object.assign(element.style, {
            overflowX: opts.x ? 'scroll' : 'hidden',
            overflowY: opts.y ? 'scroll' : 'hidden',
        })
        ctx._firstUpdateComplete = true
    },
}

module.exports = ko.bindingHandlers.scroll = scrollBinding
