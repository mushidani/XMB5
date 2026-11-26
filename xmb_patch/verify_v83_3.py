#!/usr/bin/env python3
"""Compatibility alias for older V83.3 build instructions."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('verify_v83_4.py')), run_name='__main__')
