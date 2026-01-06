const path = require('path')

const PROFILES = [
  { text: "Start 48GB RAM + 12GB VRAM", profile: "1" },
  { text: "Start 48GB RAM + 6GB VRAM", profile: "2" },
  { text: "Start 32GB RAM + 12GB VRAM", profile: "3" },
  { text: "Start 32GB RAM + 6GB VRAM", profile: "4" },
  { text: "Start 24GB RAM + 6GB VRAM", profile: "5" }
]

const get_profiles = (mode = "") => {
  return PROFILES.map(p => ({
    icon: "fa-solid fa-power-off",
    text: p.text,
    href: "start.js",
    params: {
      profile: p.profile,
      ...(mode ? { mode } : {})
    }
  }))
}

module.exports = {
  version: "3.7",
  title: "Hunyuan3D-2-LowVRAM",
  description: "Text/Image to 3D (Cross Platform: Mac + Windows + Linux): High-Resolution 3D Assets Generation with Large Scale Hunyuan3D Diffusion Models. https://github.com/deepbeepmeep/Hunyuan3D-2GP",
  icon: "icon.png",
  menu: async (kernel, info) => {
    let installed = info.exists("app/env")
    let running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js")
    }
    if (running.install) {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Installing",
        href: "install.js",
      }]
    } else if (installed) {
      if (running.start) {
        let local = info.local("start.js")
        if (local && local.url) {
          return [{
            default: true,
            icon: "fa-solid fa-rocket",
            text: "Open Web UI",
            href: local.url,
          }, {
            icon: 'fa-solid fa-terminal',
            text: "Terminal",
            href: "start.js",
          }]
        } else {
          return [{
            default: true,
            icon: 'fa-solid fa-terminal',
            text: "Terminal",
            href: "start.js",
          }]
        }
      } else if (running.update) {
        return [{
          default: true,
          icon: 'fa-solid fa-terminal',
          text: "Updating",
          href: "update.js",
        }]
      } else if (running.reset) {
        return [{
          default: true,
          icon: 'fa-solid fa-terminal',
          text: "Resetting",
          href: "reset.js",
        }]
      } else {
        if (kernel.platform === "darwin") {
          return [{
            icon: "fa-solid fa-power-off",
            text: "Hunyuan3D-2-mini-Turbo",
            href: "start.js",
            params: {
              platform: kernel.platform
            }
          }, {
            icon: "fa-solid fa-power-off",
            text: "Hunyuan3D-2-MV-Turbo (Multi View)",
            href: "start.js",
            params: {
              platform: kernel.platform,
              model_path: "tencent/Hunyuan3D-2mv",
              subfolder: "hunyuan3d-dit-v2-mv-turbo"
            }
          }, {
            icon: "fa-solid fa-plug",
            text: "Update",
            href: "update.js",
          }, {
            icon: "fa-solid fa-plug",
            text: "Install",
            href: "install.js",
          }, {
            icon: "fa-regular fa-circle-xmark",
            text: "Reset",
            href: "reset.js",
          }]
        } else {
          return [{
            icon: "fa-solid fa-power-off",
            text: "Hunyuan3D-2mini (Small)",
            menu: [{
              icon: "fa-solid fa-cube",
              text: "Original",
              menu: get_profiles()
            }, {
              icon: "fa-solid fa-bolt-lightning",
              text: "Turbo",
              menu: get_profiles("--turbo")
            }]
          }, {
            icon: "fa-solid fa-power-off",
            text: "Hunyuan3D-2mv (Multi View)",
            menu: [{
              icon: "fa-solid fa-cube",
              text: "Original",
              menu: get_profiles("--mv")
            }, {
              icon: "fa-solid fa-bolt-lightning",
              text: "Turbo",
              menu: get_profiles("--mv --turbo")
            }]
          }, {
            icon: "fa-solid fa-power-off",
            text: "Hunyuan3D-2 (Full)",
            menu: [{
              icon: "fa-solid fa-cube",
              text: "Original",
              menu: get_profiles("--h2")
            }, {
              icon: "fa-solid fa-bolt-lightning",
              text: "Turbo",
              menu: get_profiles("--h2 --turbo")
            }]
          }, {
            icon: "fa-solid fa-plug",
            text: "Update",
            href: "update.js",
          }, {
            icon: "fa-solid fa-plug",
            text: "Install",
            href: "install.js",
          }, {
            icon: "fa-regular fa-circle-xmark",
            text: "<div><strong>Reset</strong><div>Revert to pre-install state</div></div>",
            href: "reset.js",
            confirm: "Are you sure you wish to reset the app?"
          }]
        }
      }
    } else {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Install",
        href: "install.js",
      }]
    }
  }
}
