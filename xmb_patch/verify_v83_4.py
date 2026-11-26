#!/usr/bin/env python3
"""Compatibility entrypoint; V83.4 was superseded by V83.5."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('verify_v83_5.py')),run_name='__main__')
