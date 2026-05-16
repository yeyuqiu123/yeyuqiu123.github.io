"""
将 posts/ 目录下的 .tikz 文件编译为 SVG 图片
用法: python build_tikz.py
依赖: TeX Live (latex, dvisvgm)
"""
import os
import subprocess
import sys
import glob

POSTS_DIR = os.path.join(os.path.dirname(__file__), "posts")

def compile_tikz(tikz_path):
    """编译单个 .tikz 文件为 .svg"""
    name = os.path.splitext(os.path.basename(tikz_path))[0]
    work_dir = os.path.dirname(tikz_path)

    with open(tikz_path, "r", encoding="utf-8") as f:
        tikz_code = f.read()

    # 用 latex 编译生成 DVI，standalone 类支持 DVI
    latex_doc = r"""\documentclass[border=2pt]{standalone}
\usepackage{tikz}
\usetikzlibrary{arrows.meta, positioning, calc, shapes}
\begin{document}
""" + tikz_code + r"""
\end{document}"""

    tex_path = os.path.join(work_dir, f"_tikz_{name}.tex")
    dvi_path = os.path.join(work_dir, f"_tikz_{name}.dvi")
    svg_path = os.path.join(work_dir, f"{name}.svg")

    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(latex_doc)

    # latex -> DVI
    result = subprocess.run(
        ["latex", "-interaction=nonstopmode", "-output-directory", work_dir, tex_path],
        capture_output=True
    )
    if not os.path.exists(dvi_path):
        print(f"  [ERROR] latex failed for {name}")
        _cleanup(work_dir, name)
        return False

    # DVI -> SVG
    result = subprocess.run(
        ["dvisvgm", "--no-fonts", "-o", svg_path, dvi_path],
        capture_output=True
    )
    if not os.path.exists(svg_path):
        print(f"  [ERROR] dvisvgm failed for {name}")
        _cleanup(work_dir, name)
        return False

    _cleanup(work_dir, name)
    print(f"  [OK] {name}.svg")
    return True


def _cleanup(work_dir, name):
    for ext in [".tex", ".dvi", ".log", ".aux"]:
        tmp = os.path.join(work_dir, f"_tikz_{name}{ext}")
        if os.path.exists(tmp):
            os.remove(tmp)


def main():
    tikz_files = glob.glob(os.path.join(POSTS_DIR, "*.tikz"))
    if not tikz_files:
        print("No .tikz files found in posts/")
        return

    print(f"Found {len(tikz_files)} TikZ file(s), compiling...")

    try:
        subprocess.run(["dvisvgm", "--version"], capture_output=True, check=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("[ERROR] dvisvgm not found. Install TeX Live.")
        sys.exit(1)

    success = 0
    for tikz_path in tikz_files:
        if compile_tikz(tikz_path):
            success += 1

    print(f"\nDone: {success}/{len(tikz_files)} succeeded")


if __name__ == "__main__":
    main()
