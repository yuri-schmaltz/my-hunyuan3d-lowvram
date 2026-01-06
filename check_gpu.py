import sys
try:
    import torch
    print(f"Torh Version: {torch.__version__}")
    if torch.cuda.is_available():
        print(f"GPU Available: Starting with {torch.cuda.get_device_name(0)}")
    elif torch.backends.mps.is_available():
        print("MPS Available: Starting on Mac")
    else:
        print("WARNING: No GPU detected (CUDA/MPS). Running on CPU might be too slow.")
except Exception as e:
    print(f"CRITICAL: Failed to import torch. {e}")
    sys.exit(1)
