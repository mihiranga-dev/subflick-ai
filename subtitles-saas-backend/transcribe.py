import whisper
import torch

def check_system():
    # chech gpu
    gpu_available = torch.cuda.is_available()
    device_name = torch.cuda.get_device_name(0) if gpu_available else "None"

    print(f"\n System Check:")
    print(f" - GPU Available: {gpu_available}")
    print(f" - GPU Name: {device_name}")

    if not gpu_available:
        print(" Warning: You are using CPU. It will be slow!")
    else:
        print(" Great: Running on GPU")    

    # check Whisper load
    print("\n Loading Whisper Model (this takes time only once)...")
    try:
        model = whisper.load_model("base", device="cuda" if gpu_available else "cpu")
        print("Whisper loaded successfully!")
    except Exception as e:
        print(f" Error Loading Whisper: {e}")

if __name__ == "__main__":
    check_system()