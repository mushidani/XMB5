#!/usr/bin/env python3
"""Compatibility: V83.12 supersedes the V83.11 timing checks."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('verify_v83_12.py')),run_name='__main__')
