"""Backward-compatible definitions module.

The old package exposed a ``definitions`` submodule whose ``__all__`` was a
list of snake_case measure group names, e.g.::

    from corva_unit_converter.definitions import __all__
    # ['acoustic_slowness', 'angle', 'area', 'concentration', ...]

This module reconstructs that list dynamically from ``get_measures()`` so it
always stays in sync with the available measures.
"""
from __future__ import annotations

from .converter import get_measures

__all__: list[str] = sorted(get_measures())
