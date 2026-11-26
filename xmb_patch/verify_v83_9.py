#!/usr/bin/env python3
"""V83.9 check superseded by V83.10."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('verify_v83_10.py')),run_name='__main__')
