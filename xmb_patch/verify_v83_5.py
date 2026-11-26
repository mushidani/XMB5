#!/usr/bin/env python3
"""This feature was superseded by V83.9; check latest invariants."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('verify_v83_9.py')),run_name='__main__')
