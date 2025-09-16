let _toggle: (() => void) | null = null;
let _open: (() => void) | null = null;
let _close: (() => void) | null = null;

export const setDrawerControls = (opts: {
  toggle?: () => void;
  open?: () => void;
  close?: () => void;
}) => {
  _toggle = opts.toggle || _toggle;
  _open = opts.open || _open;
  _close = opts.close || _close;
};

export const toggleDrawer = () => _toggle?.();
export const openDrawer = () => _open?.();
export const closeDrawer = () => _close?.();

