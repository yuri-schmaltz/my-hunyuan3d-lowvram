const CONFIG = {
  REPO: {
    MAC: "https://github.com/Tencent/Hunyuan3D-2",
    WIN_LINUX: "https://github.com/deepbeepmeep/Hunyuan3D-2GP"
  }
}

module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          `git clone {{platform === 'darwin' ? '${CONFIG.REPO.MAC}' : '${CONFIG.REPO.WIN_LINUX}'}} app`,
        ]
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app",
          // xformers: true
        }
      }
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "shell.run",
      params: {
        env: {},
        venv: "env",
        path: "app",
        message: [
          "uv pip install ../wheels/diso-0.1.4-cp310-cp310-win_amd64.whl",
          "uv pip install -r requirements.txt",
          "uv pip install sentencepiece hf-xet",
          "uv pip install ../wheels/custom_rasterizer-0.1-cp310-cp310-win_amd64.whl",
          "uv pip install ../wheels/mesh_processor-0.0.0-cp310-cp310-win_amd64.whl"
        ]
      },
      next: null
    },
    {
      method: "shell.run",
      params: {
        build: true,
        env: {
          USE_NINJA: 0,
          DISTUTILS_USE_SDK: 1,
          TORCH_CUDA_ARCH_LIST: "6.1;7.5;8.6;8.9;12.0"
        },
        venv: "env",
        path: "app",
        message: [
          "uv pip install setuptools==65.5.0 wheel",
          "{{gpu === 'nvidia' ? 'uv pip install --no-build-isolation diso==0.1.4' : null}}",
          "{{platform === 'darwin' ? 'uv pip install numba>0.60.0' : null}}",
          "uv pip install -r requirements.txt",
          "uv pip install sentencepiece hf-xet",
        ]
      }
    },
    {
      when: "{{platform === 'linux'}}",
      method: "shell.run",
      params: {
        message: [
          "conda install -y -c conda-forge 'gxx<12'",
          "which g++"
        ]
      }
    },
    {
      when: "{{platform === 'linux'}}",
      method: "shell.run",
      params: {
        build: true,
        venv: "../../../env",
        env: {
          USE_NINJA: 0,
          DISTUTILS_USE_SDK: 1,
          NVCC_PREPEND_FLAGS: "-ccbin {{which('g++')}}",
          TORCH_CUDA_ARCH_LIST: "6.1;7.5;8.6;8.9;12.0"
        },
        path: "app/hy3dgen/texgen/custom_rasterizer",
        message: [
          "python setup.py install"
        ]
      }
    },
    {
      when: "{{platform === 'linux'}}",
      method: "shell.run",
      params: {
        build: true,
        venv: "../../../env",
        env: {
          USE_NINJA: 0,
          DISTUTILS_USE_SDK: 1,
          NVCC_PREPEND_FLAGS: "-ccbin {{which('g++')}}",
          TORCH_CUDA_ARCH_LIST: "6.1;7.5;8.6;8.9;12.0"
        },
        path: "app/hy3dgen/texgen/differentiable_renderer",
        message: [
          "python setup.py install"
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "python ../check_gpu.py"
      }
    }
  ]
}
