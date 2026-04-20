"""Build CD/HZ regen queue with photo-realistic prompts tuned for
location-specificity (DALL-E / Gemini 3 Pro 通吃)."""
import json, os

ROOT = os.path.expanduser('~/weekend-go')

# Hand-curated location-specific anchors per dest
ANCHORS = {
    # Chengdu (id 1300-1311)
    1300: ('宽窄巷子', 'Three parallel stone-paved alleys lined with Qing-dynasty siheyuan courtyard houses, ornate wooden eaves, rows of red lanterns strung overhead, bamboo-chair teahouse patrons enjoying afternoon tea, local snack vendors, golden-hour warm light casting long shadows'),
    1301: ('大熊猫繁育研究基地', 'Lush bamboo grove in early morning mist, three giant pandas (two adults lounging, one cub climbing a tree), wooden observation pathways, misty mountain backdrop, cool green-tinted soft light'),
    1302: ('锦里古街', 'Narrow stone alley lined with Sichuan-opera mask shops, strings of red lanterns glowing at dusk, street food stalls with steam rising, wooden storefronts with carved eaves, warm amber lanternlight'),
    1303: ('都江堰', 'Ancient Fish Mouth Levee splitting the Min River, bamboo cages filled with river stones, temple complex at shore, forested mountains, clear sunny sky, overhead aerial-style composition showing the weir'),
    1304: ('青城山', 'Mist-shrouded Taoist temples on densely forested mountain, winding stone pathway with moss, bamboo grove on sides, pagoda roof glimpsed through trees, ethereal morning fog, cool green palette'),
    1305: ('武侯祠', 'Red temple walls, ancient cypress trees over 1800 years old, stone stele commemorating Zhuge Liang, traditional Chinese courtyard temple gate, autumn leaves, warm earthy palette'),
    1306: ('峨眉山', 'Golden Summit at sunrise with the four-elephant Samantabhadra Bodhisattva statue shining, vast sea of clouds below, distant snow-capped peaks, glowing golden light piercing mist'),
    1307: ('乐山大佛', '71-meter seated Buddha carved into red sandstone cliff face, massive scale with tiny visitors at the feet, river confluence of Min and Dadu at base, lush green hills surround'),
    1308: ('西岭雪山', 'Snow-covered alpine ski resort with groomed slopes, snow-laden pines, red cable-car gondolas against clear blue sky, skiers carving turns, crisp winter sunlight'),
    1309: ('杜甫草堂', 'Thatched cottage literati garden, lotus pond in foreground with lily pads, bamboo grove surrounding, stele with Du Fu poetry, traditional wooden corridors, soft spring light'),
    1310: ('春熙路', 'Futuristic IFS Building with giant 3D panda sculpture climbing its exterior wall, bustling pedestrian shopping street below, LED billboards, shoppers, evening ambient glow'),
    1311: ('人民公园', 'Rows of old-style bamboo chairs outside Heming Teahouse, locals chatting over gaiwan tea cups, sichuan-style mahjong tables, ear-cleaner at work with tuning fork, dappled park sunlight'),
    # Hangzhou (id 1400-1409)
    1400: ('西湖', 'West Lake seen from Su Causeway in spring, willow branches with new green leaves, traditional wooden boats on water, Leifeng Pagoda on distant hillside, misty Nanping mountain backdrop, soft golden afternoon light'),
    1401: ('灵隐寺', 'Ancient Buddhist temple complex amid dense old-growth forest, rock-carved Maitreya Buddha of Feilai Feng, saffron-robed monks, incense smoke rising, cool green forest shade'),
    1402: ('龙井茶田', 'Terraced tea plantations cascading down misty hillside, tea pickers in straw hats with bamboo baskets, young green tea leaves, traditional stone farmhouse, morning mist in valleys'),
    1403: ('宋城', 'Reconstructed Song-dynasty town square with costumed performers in Hanfu, ornate wooden pavilions, arched bridges, red-and-gold lanterns, traditional martial arts demonstration in foreground'),
    1404: ('西溪湿地', 'Winding wetland waterways through reed marshes and lily pads, wooden-punted boat gliding quietly, weeping willows at banks, morning mist, cool blue-green palette'),
    1405: ('千岛湖', 'High aerial vista of azure lake dotted with hundreds of forested small islands, pure blue sky, distant mountain ranges, sense of vast scale and tranquility'),
    1406: ('乌镇', 'Whitewashed Jiangnan water-town houses with dark-tiled sloped roofs, arched stone bridge over narrow canal, wooden boat passing beneath, red lanterns at doorways, evening lantern light'),
    1407: ('南宋御街', 'Song-dynasty reconstructed pedestrian street with old-style storefronts, red lanterns strung overhead, stone paving, traditional calligraphy signs, vendors with old-style carts'),
    1408: ('杭州雷峰塔', 'Rebuilt five-story Leifeng Pagoda at sunset on southern shore of West Lake, glowing warm from interior lights, lake reflection below, distant Bao Chu Pagoda on opposite shore, dramatic sunset sky'),
    1409: ('中国美术学院象山校区', "Wang Shu's award-winning recycled-tile campus architecture, organic curved buildings covered in reclaimed grey roof tiles, teaching pavilions on terraced hilly terrain, bamboo and trees integrated, overcast soft light"),
}

# Photo-realistic prompt template (location-specific, NO kawaii)
PROMPT_TEMPLATE = (
    'Photo-realistic editorial travel magazine cover photograph of {name} in {city_en}, China. '
    '{anchor}. '
    'Wide 16:9 cinematic landscape composition (LANDSCAPE PANORAMIC 16:9 widescreen, NEVER vertical). '
    'DSLR-quality photograph, editorial travel-poster aesthetic, warm natural lighting, rich architectural or natural detail. '
    'NO cartoon, NO chibi, NO kawaii, NO mascots, NO anime style. '
    'Real-world textures: stone, wood, water, foliage. Atmospheric but realistic. Inviting travel-guide feel.'
)

def city_en(id_):
    if 1300 <= id_ <= 1399: return 'Chengdu, Sichuan'
    if 1400 <= id_ <= 1499: return 'Hangzhou, Zhejiang'
    return 'China'

queue = []
for id_, (name, anchor) in ANCHORS.items():
    prefix = 'dest-cd' if 1300 <= id_ <= 1399 else 'dest-hz'
    fname = f'{prefix}-{id_}.webp'
    prompt = PROMPT_TEMPLATE.format(name=name, city_en=city_en(id_), anchor=anchor)
    queue.append({
        'id': id_,
        'name': name,
        'file': fname,
        'city': 'chengdu' if 1300 <= id_ <= 1399 else 'hangzhou',
        'prompt': prompt,
    })

out = f'{ROOT}/cdhz-regen-queue.json'
json.dump(queue, open(out, 'w'), ensure_ascii=False, indent=2)
print(f'wrote {out} with {len(queue)} items')
print('--- sample item ---')
print(json.dumps(queue[0], ensure_ascii=False, indent=2)[:800])
