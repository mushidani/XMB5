#!/usr/bin/env python3
"""Compatibility alias for users following the previous V83.2 instructions."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('verify_v83_3.py')), run_name='__main__')
