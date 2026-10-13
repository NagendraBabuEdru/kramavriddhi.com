# Tiles the preview stills of one episode into _social/videos/rex/stories/sheet-<id>.jpg
# usage: python sheet.py <episode> [columns]
import glob, os, subprocess, sys
ep, cols = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 8
d = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'videos', 'rex', 'stories')
files = sorted(glob.glob(os.path.join(d, 'frames', ep + '-*.jpg')))
w = 240
layout = '|'.join(f'{(i % cols) * w}_{(i // cols) * 9999}' for i in range(len(files)))
args = sum([['-i', f] for f in files], [])
first = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', files[0]], capture_output=True, text=True).stdout.strip().split(',')
h = round(w * int(first[1]) / int(first[0]))
layout = '|'.join(f'{(i % cols) * w}_{(i // cols) * h}' for i in range(len(files)))
fc = ''.join(f'[{i}]scale={w}:{h}[s{i}];' for i in range(len(files))) + ''.join(f'[s{i}]' for i in range(len(files))) + f'xstack=inputs={len(files)}:layout={layout}:fill=black'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y'] + args + ['-filter_complex', fc, os.path.join(d, f'sheet-{ep}.jpg')], check=True)
print('sheet', len(files))
