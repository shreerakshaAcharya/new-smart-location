import os
import torch
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image

# Global model cache
_model = None
_weights = None
_categories = None

# Mapping common ImageNet class substrings to household categories and rooms
HOUSEHOLD_MAP = [
    # Electronics & Devices
    (["notebook", "laptop"], "Laptop", "Electronics", "Study Desk", "Workstation Surface"),
    (["mouse", "computer mouse"], "Computer Mouse", "Electronics", "Study Desk", "Desk Pad"),
    (["keyboard"], "Keyboard", "Electronics", "Study Desk", "Workstation Surface"),
    (["cellular telephone", "cellphone", "mobile phone", "cell"], "Smartphone", "Electronics", "Bedroom", "Nightstand Table"),
    (["headphone", "earphone", "earbuds"], "Wireless Earphones", "Audio & Devices", "Bedroom", "Nightstand Table"),
    (["plug", "power cord", "extension cord", "adapter"], "Charger", "Cables & Power", "Bedroom", "Study Desk Drawer"),
    (["hard disc", "hard drive"], "External Hard Drive", "Electronics", "Study Desk", "Desk Drawer"),
    (["modem", "router"], "Wi-Fi Router", "Networking", "Living Room", "TV Cabinet"),

    # Personal Essentials & Accessories
    (["wallet", "billfold", "purse", "moneybag"], "Wallet", "Personal Essentials", "Bedroom", "Wardrobe Upper Shelf"),
    (["digital watch", "analog watch", "stopwatch", "wrist watch"], "Smart Watch", "Accessories", "Bedroom", "Dressing Table"),
    (["sunglasses", "spectacles", "glasses"], "Eyeglasses", "Accessories", "Living Room", "Wall Shelf"),
    (["keys", "padlock", "combination lock"], "House Keys", "Essentials", "Living Room", "Wall Shelf"),
    (["passport", "envelope", "binder", "packet"], "Passport & Documents", "Documents", "Bedroom", "Wardrobe Upper Shelf"),

    # Bags & Clothing
    (["backpack", "knapsack", "rucksack", "haversack"], "Backpack", "Bags & Storage", "Bedroom", "Wardrobe Upper Shelf"),
    (["umbrella"], "Umbrella", "Outdoors", "Living Room", "Wall Shelf"),
    (["shoe", "sneaker", "running shoe"], "Shoes", "Footwear", "Bedroom", "Wardrobe Upper Shelf"),
    (["sock", "stocking"], "Socks", "Apparel", "Bedroom", "Drawer"),

    # Kitchen & Everyday
    (["water bottle", "pop bottle"], "Water Bottle", "Kitchen & Hydration", "Kitchen", "Countertop Rack"),
    (["coffee mug", "cup", "teacup"], "Coffee Mug", "Kitchen", "Kitchen", "Countertop Rack"),
    (["plate", "platter"], "Plate / Dishware", "Kitchen", "Kitchen", "Upper Cabinet B"),
    (["frying pan", "pan"], "Cookware", "Kitchen", "Kitchen", "Lower Cabinet"),

    # Stationery & Health
    (["ballpoint", "fountain pen", "pencil", "quill"], "Pen / Stationery", "Stationery", "Study Desk", "Pen Stand"),
    (["book", "notebook", "binder", "comic book"], "Notebook / Book", "Reading & Study", "Study Desk", "Bookcase Shelf"),
    (["pill bottle", "lotion", "medicine chest"], "First Aid / Medicine", "Health & Wellness", "Bedroom", "Nightstand Table")
]


def load_ai_model():
    """Lazily loads the pretrained MobileNetV3 model on CPU."""
    global _model, _weights, _categories
    if _model is None:
        _weights = models.MobileNet_V3_Small_Weights.DEFAULT
        _categories = _weights.meta["categories"]
        _model = models.mobilenet_v3_small(weights=_weights)
        _model.eval()
    return _model, _categories, _weights


def recognize_object_from_image(image_path_or_file):
    """
    Performs visual recognition on an uploaded object photograph.
    Returns:
        dict containing suggested_name, category, confidence, needs_confirmation,
        suggested_room, suggested_location, and top_predictions.
    """
    model, categories, weights = load_ai_model()

    # Open image
    if hasattr(image_path_or_file, 'read'):
        image = Image.open(image_path_or_file).convert('RGB')
    elif isinstance(image_path_or_file, str) and os.path.exists(image_path_or_file):
        image = Image.open(image_path_or_file).convert('RGB')
    else:
        raise ValueError("Invalid image provided for recognition.")

    # Apply standard preprocessing transforms for MobileNetV3
    preprocess = weights.transforms()
    input_tensor = preprocess(image).unsqueeze(0)  # Add batch dimension

    with torch.no_grad():
        output = model(input_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)

    # Get top 5 predictions
    top5_prob, top5_catid = torch.topk(probabilities, 5)

    top_predictions = []
    for i in range(5):
        cat_name = categories[top5_catid[i].item()]
        prob = float(top5_prob[i].item())
        top_predictions.append({
            "label": cat_name,
            "probability": round(prob, 4)
        })

    best_cat_raw = categories[top5_catid[0].item()]
    best_prob = float(top5_prob[0].item())

    # Check for match in our household mapper
    matched_item = None
    for pred in top_predictions:
        label_lower = pred["label"].lower()
        for keywords, name, category, room, loc in HOUSEHOLD_MAP:
            for kw in keywords:
                if kw in label_lower:
                    matched_item = {
                        "suggested_name": name,
                        "category": category,
                        "confidence": round(pred["probability"], 2),
                        "suggested_room": room,
                        "suggested_location": loc
                    }
                    break
            if matched_item:
                break
        if matched_item:
            break

    if matched_item:
        suggested_name = matched_item["suggested_name"]
        category = matched_item["category"]
        confidence = matched_item["confidence"]
        suggested_room = matched_item["suggested_room"]
        suggested_location = matched_item["suggested_location"]
    else:
        # Fallback to cleaned ImageNet label
        clean_name = best_cat_raw.split(',')[0].replace('_', ' ').title()
        suggested_name = clean_name
        category = "Household Item"
        confidence = round(best_prob, 2)
        suggested_room = "Bedroom"
        suggested_location = "Study Desk Drawer"

    # Flag if confidence is low (< 0.20 or generic fallback)
    needs_confirmation = confidence < 0.25

    return {
        "status": "success",
        "suggested_name": suggested_name,
        "category": category,
        "confidence": confidence,
        "confidence_percentage": f"{int(confidence * 100)}%",
        "needs_confirmation": needs_confirmation,
        "suggested_room": suggested_room,
        "suggested_location": suggested_location,
        "top_predictions": top_predictions
    }


import numpy as np


def get_color_histogram(pil_image):
    """Computes a normalized color histogram vector for color distribution comparison."""
    img = pil_image.resize((64, 64)).convert('RGB')
    arr = np.array(img).astype(np.float32)
    r_hist, _ = np.histogram(arr[:, :, 0], bins=8, range=(0, 256), density=True)
    g_hist, _ = np.histogram(arr[:, :, 1], bins=8, range=(0, 256), density=True)
    b_hist, _ = np.histogram(arr[:, :, 2], bins=8, range=(0, 256), density=True)
    hist = np.concatenate([r_hist, g_hist, b_hist])
    norm = np.linalg.norm(hist)
    return hist / (norm + 1e-7)


def get_image_embedding_and_color(image_input):
    """
    Extracts both MobileNetV3 neural feature vector and color histogram.
    """
    model, _, weights = load_ai_model()
    if hasattr(image_input, 'read'):
        image = Image.open(image_input).convert('RGB')
    elif isinstance(image_input, str) and os.path.exists(image_input):
        image = Image.open(image_input).convert('RGB')
    elif isinstance(image_input, Image.Image):
        image = image_input.convert('RGB')
    else:
        raise ValueError("Invalid image input for embedding extraction.")

    preprocess = weights.transforms()
    input_tensor = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        features = model.features(input_tensor)
        pooled = model.avgpool(features)
        flat = torch.flatten(pooled, 1)
        normalized_emb = torch.nn.functional.normalize(flat, p=2, dim=1)

    color_hist = get_color_histogram(image)
    return normalized_emb, color_hist


def get_image_embedding(image_input):
    """
    Extracts a normalized 576-dimensional L2-normalized feature embedding
    from MobileNetV3 feature extractor.
    """
    emb, _ = get_image_embedding_and_color(image_input)
    return emb


def match_image_against_saved_items(uploaded_image_file, saved_items, base_dir, threshold=0.65):
    """
    Compares an uploaded query image against real saved items in the database.
    Extracts visual feature representations and computes cosine similarity.
    Does NOT infer location from visual analysis; returns the actual database record.
    """
    if not saved_items:
        return {
            "status": "success",
            "matched": False,
            "message": "No items with saved photos exist in your database yet. Save an item with a photo first or search by text.",
            "candidates": []
        }

    try:
        query_emb, query_color = get_image_embedding_and_color(uploaded_image_file)
    except Exception as e:
        return {
            "status": "error",
            "matched": False,
            "message": f"Could not process uploaded photo: {str(e)}"
        }

    scored_items = []
    for item in saved_items:
        img_rel = item.get("image_path")
        if not img_rel:
            continue
        full_path = os.path.join(base_dir, img_rel.lstrip("/").replace('/', os.sep))
        if not os.path.exists(full_path):
            continue
        try:
            item_emb, item_color = get_image_embedding_and_color(full_path)
            neural_sim = torch.mm(query_emb, item_emb.t()).item()
            color_sim = float(np.dot(query_color, item_color))
            # Hybrid visual similarity: 60% deep neural features + 40% color distribution
            sim = (0.6 * neural_sim) + (0.4 * color_sim)
            scored_items.append((sim, item))
        except Exception:
            continue

    if not scored_items:
        return {
            "status": "success",
            "matched": False,
            "message": "None of your saved items currently have accessible photo files on disk. Please search by text.",
            "candidates": []
        }

    scored_items.sort(key=lambda x: x[0], reverse=True)
    best_sim, best_item = scored_items[0]

    all_candidates = [
        {
            "id": it["id"],
            "object_name": it["object_name"],
            "room_name": it.get("room_name"),
            "location_name": it.get("location_name"),
            "full_location_path": it.get("full_location_path"),
            "image_path": it.get("image_path"),
            "description": it.get("description", ""),
            "similarity": round(s, 3),
            "similarity_percentage": f"{int(s * 100)}%"
        }
        for s, it in scored_items[:5]
    ]

    if best_sim >= threshold:
        return {
            "status": "success",
            "matched": True,
            "best_similarity": round(best_sim, 3),
            "similarity_percentage": f"{int(best_sim * 100)}%",
            "match": best_item,
            "candidates": all_candidates
        }
    else:
        return {
            "status": "success",
            "matched": False,
            "best_similarity": round(best_sim, 3),
            "similarity_percentage": f"{int(best_sim * 100)}%",
            "message": "No close visual match found among your saved items. Try searching by text or uploading a clearer photo.",
            "candidates": all_candidates if best_sim > 0.45 else []
        }

