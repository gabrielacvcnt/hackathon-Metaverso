import requests
from rest_framework.response import Response
from rest_framework import status
from decouple import config
from .serializer import SearchSteamResultSerializer, SearchDota2ResultSerializer, SearchRiotResultSerializer
from rest_framework.views import APIView

#API_KEY = config('STEAM_API_KEY')
RIOT_API_KEY = config('RIOT_API_KEY')

def calcular_media_DOTA2(dados_partidas):
    if not dados_partidas:
        return {"erro": "A lista de partidas está vazia."}
    
    totalizadores = {
        "kda": 0,
        "gold_per_min": 0,
        "xp_per_min": 0,
        "last_hits": 0,
        "denies": 0,
        "lane_efficiency_pct": 0,
    }

    for matches in dados_partidas:
        totalizadores["kda"] += matches.get("kda", 0)
        totalizadores["gold_per_min"] += matches.get("gold_per_min", 0)
        totalizadores["xp_per_min"] += matches.get("xp_per_min", 0)
        totalizadores["last_hits"] += matches.get("last_hits", 0)
        totalizadores["denies"] += matches.get("denies", 0)
        totalizadores["lane_efficiency_pct"] += matches.get("lane_efficiency_pct", 0)

    num_matches = len(dados_partidas)

    medias = {
        "media_kda": round(totalizadores["kda"]/ num_matches, 2),
        "media_gpm": round(totalizadores["gold_per_min"] / num_matches, 2),
        "media_xpm": round(totalizadores["xp_per_min"] / num_matches, 2),
        "media_last_hits": round(totalizadores["last_hits"] / num_matches, 2),
        "media_denies": round(totalizadores["denies"] / num_matches, 2),
        "media_lane_efficiency_pct": round(totalizadores["lane_efficiency_pct"] / num_matches, 2),
    }

    return medias

def calcular_media_LOL(dados_partidas):
    if not dados_partidas:
        return {"error": "A lista está vazia"}
    
    totalizadores = {
        "kda": 0,
        "CS": 0,
        "Gold": 0
    }

    for partida in dados_partidas:
        totalizadores["kda"] += partida.get("kda", 0)
        totalizadores["CS"] += partida.get("CS", 0)
        totalizadores["Gold"] += partida.get("Gold", 0)

    num_partidas =  len(dados_partidas)

    medias ={
        "media_kda": round(totalizadores["kda"]/ num_partidas ,2),
        "media_CS": round(totalizadores["CS"]/ num_partidas ,2),
        "media_Gold": round(totalizadores["Gold"]/ num_partidas ,2)
    }

    return medias
#Steam
class SearchSteam(APIView):
    serializer_class = SearchSteamResultSerializer

    def post(self, request):
        player_name = request.data.get('player_name')
        steam_id = request.data.get('steam_id')
        if not player_name:
            return Response({'error': 'O campo player_name é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        url = f'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key={API_KEY}&vanityurl={player_name}'
        response = requests.get(url)

        if response.status_code == 200:
            steam_id = self.search(response.json())
            if steam_id:
                return Response({'steam_id': steam_id, 'player_name': player_name})
            else:
                return Response({'error': 'Usuário não encontrado', 'player_name': player_name}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Falha na comunicação com a API Steam.'}, status=response.status_code)

    def search(self, search_result):
        return search_result.get('response', {}).get('steamid')
    
class SearchDota2(APIView):
    serializer_class = SearchDota2ResultSerializer

    def search_dota(self, steam_id):
        try:
            id32 = int(steam_id)
        except Exception:
            return {"error": "Invalid Steam ID"}

        profile_url = f'https://api.opendota.com/api/players/{id32}'
        player_response = requests.get(profile_url)
        if player_response.status_code != 200:
            return {"error": "Failed to fetch player profile"}

        player_data = player_response.json()
        profile = player_data.get('profile', {})
        account_id = profile.get('account_id')
        personaname = profile.get('personaname')
        rank_tier = profile.get('rank_tier')

        matches_url = f'https://api.opendota.com/api/players/{id32}/recentMatches'
        matches_response = requests.get(matches_url)
        if matches_response.status_code != 200:
            return {"error": "Failed to fetch matches"}

        matches_data = matches_response.json()
        recent_matches = matches_data[:10] if isinstance(matches_data, list) else []

        matches = []
        for m in recent_matches:
            match_id = m.get("match_id")
            if not match_id:
                continue

            detail_url = f'https://api.opendota.com/api/matches/{match_id}'
            detail_response = requests.get(detail_url)
            if detail_response.status_code != 200:
                continue

            detail_data = detail_response.json()

            player_detail = next(
                (p for p in detail_data.get("players", []) if p.get("account_id") == id32),
                None
            )

            player_metrics = {}
            if player_detail:
                player_metrics = {
                    "kills": player_detail.get("kills"),
                    "deaths": player_detail.get("deaths"),
                    "assists": player_detail.get("assists"),
                    "kda": player_detail.get("kda"),
                    "gold_per_min": player_detail.get("gold_per_min"),
                    "xp_per_min": player_detail.get("xp_per_min"),
                    "last_hits": player_detail.get("last_hits"),    
                    "denies": player_detail.get("denies"),
                    "level": player_detail.get("level"),
                    "net_worth": player_detail.get("net_worth"),
                    "lane_efficiency_pct": player_detail.get("lane_efficiency_pct"),
                }

            match_detail = {
                "duration": detail_data.get("duration"),
                "radiant_win": detail_data.get("radiant_win"),
                "region": detail_data.get("region"),
                "game_mode": detail_data.get("game_mode"),
                "player_metrics": player_metrics,
            }
            
            
            matches.append({
                "match_id": match_id,
                "hero_id": m.get("hero_id"),
                "start_time": m.get("start_time"),
                "duration": m.get("duration"),
                "lobby_type": m.get("lobby_type"),
                "skill": m.get("skill"),
                "player_slot": m.get("player_slot"),
                "detail": match_detail
            })

        return {
            "profile": {
                "account_id": account_id,
                "personaname": personaname,
                "rank_tier": rank_tier
            },
            "matches": matches
        }

    def post(self, request):
        steam_id = request.data.get('id')
        if not steam_id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        data = self.search_dota(steam_id)
        return Response(data, status=status.HTTP_200_OK)

#Riot
class SearchMatchesRiot(APIView):
    
    @staticmethod
    def search_riot(region, match_id):
        match_url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={RIOT_API_KEY}'
        match_response = requests.get(match_url)

        if match_response.status_code != 200:
            return None

        match_data = match_response.json()
        info = match_data.get('info', {})
        participants = info.get('participants', [])
        gameDuration = info.get('gameDuration')
        gameType = info.get('gameType')
        queueId = info.get('queueId')
        gameVersion = info.get('gameVersion')

        result = []
        for p in participants:
            puuid = p.get("puuid")
            challenges = p.get("challenges", {})
            teamPosition = p.get("teamPosition", "")

            if teamPosition == "":
                teamPosition = "ARAM"

            result.append({
                "puuid": puuid,
                "playerName": p.get("riotIdGameName"),
                "tagLine": p.get("riotIdTagline"),
                "goldPerMinute": challenges.get("goldPerMinute"),
                "controlWardsPlaced": p.get("controlWardsPlaced"),
                "firstTurretKilled": int(p.get("firstTurretKilled", False)),
                "gameEndedInSurrender": p.get("gameEndedInSurrender"),
                "kills": p.get("kills"),
                "deaths": p.get("deaths"),
                "assists": p.get("assists"),
                "championName": p.get("championName"),
                "lane": p.get("lane"),
                "teamPosition": teamPosition,
                "win": p.get("win"),
        })

        return {
            "matchId": match_id,
            "participants": result,
            "gameDuration": gameDuration,
            "gameType": gameType,
            "queueId": queueId,
            "gameVersion": gameVersion,
        }

    def post(self, request):
        match_id = request.data.get('matchId')
        region = request.data.get('region')

        if not match_id or not region:
            return Response({'error': 'Todos os campos são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)

        details = self.search_riot(region, match_id)
        if details:
            return Response(details)
        else:
            return Response({'error': 'Erro ao buscar detalhes da partida.'}, status=status.HTTP_404_NOT_FOUND)

class SearchRiot(APIView):
    serializer_class = SearchRiotResultSerializer

    def post(self, request):
        gameName = request.data.get('gameName')
        tagLine = request.data.get('tagLine')
        region = request.data.get('region')

        if not gameName or not tagLine or not region:
            return Response({'error': 'Todos os campos são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)

        account_url = f'https://{region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}?api_key={RIOT_API_KEY}'
        account_response = requests.get(account_url)

        if account_response.status_code != 200:
            return Response(
                {'error': 'Erro ao buscar conta Riot.', 'status_code': account_response.status_code},
                status=account_response.status_code
            )

        account_data = account_response.json()
        puuid = account_data.get("puuid")

        if not puuid:
            return Response({'error': 'PUUID não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        match_url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=10&api_key={RIOT_API_KEY}'
        match_response = requests.get(match_url)

        if match_response.status_code != 200:
            return Response(
                {'error': 'Erro ao buscar partidas.', 'status_code': match_response.status_code},
                status=match_response.status_code
            )

        match_ids = match_response.json()

        match_details = []
        for match_id in match_ids:
            details = SearchMatchesRiot.search_riot(region, match_id)
            if details:
                match_details.append(details)

        return Response({
            "puuid": puuid,
            "gameName": gameName,
            "tagLine": tagLine,
            "matches": match_details
        })


class DashboardView(APIView):

    def post(self, request):
        game = (request.data.get("game") or "").lower()

        if game == "dota2":
            steam_id = request.data.get('id')
            if not steam_id:
                return Response({'error': 'id (steam id) é obrigatório para DOTA2'}, status=status.HTTP_400_BAD_REQUEST)

            dota_view = SearchDota2()
            data = dota_view.search_dota(steam_id)

            if isinstance(data, dict) and data.get('error'):
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            if "game_mode" == 22:
                matches = data.get('matches', [])
                player_metrics_list = [
                    m.get('detail', {}).get('player_metrics', {})
                    for m in matches
                    if m.get('detail', {}).get('player_metrics')
                ]
                return player_metrics_list

            medias = calcular_media_DOTA2(player_metrics_list) if player_metrics_list else {}

            metrics = {k: v for k, v in metricsDOTA2.__dict__.items() if not k.startswith('__') and not callable(v)}

            return Response({
                'game': 'dota2',
                'profile': data.get('profile'),
                'medias': medias,
                'metrics': metrics,
                'matches_count': len(matches)
            })

        elif game in ('lol', 'riot'):
            gameName = request.data.get('gameName')
            tagLine = request.data.get('tagLine')
            region = request.data.get('region')

            if not gameName or not tagLine or not region:
                return Response({'error': 'gameName, tagLine e region são obrigatórios para LOL'}, status=status.HTTP_400_BAD_REQUEST)

            riot_view = SearchRiot()
            
            riot_response = riot_view.post(request)

            if riot_response.status_code != 200:
                return riot_response

            riot_data = riot_response.data
            puuid = riot_data.get('puuid')
            match_list = riot_data.get('matches', [])

            if "queueId" == 420:
                partidas_para_media = []
                for match in match_list:
                    participants = match.get('participants', [])
                    # procura o participante que é o usuario
                    player = next((p for p in participants if p.get('puuid') == puuid), None)
                    if not player:
                        continue

                    kills = player.get('kills', 0) or 0
                    deaths = player.get('deaths', 0) or 0
                    assists = player.get('assists', 0) or 0

                    # calcula um KDA defensivo (evita divisão por zero)
                    kda = round((kills + assists) / (deaths if deaths > 0 else 1), 2)
                    CS = player.get('minionsKilled', 0) or 0
                    # tenta obter gold por minuto (se disponível) como proxy
                    gold = player.get('goldPerMinute', 0) or 0

                    partidas_para_media.append({
                        'kda': kda,
                        'CS': CS,
                        'Gold': gold,
                    })

                    return partidas_para_media

            medias = calcular_media_LOL(partidas_para_media) if partidas_para_media else {}

            metrics = {k: v for k, v in metricsLOL.__dict__.items() if not k.startswith('__') and not callable(v)}

            return Response({
                'game': 'lol',
                'puuid': puuid,
                'medias': medias,
                'metrics': metrics,
                'matches_count': len(match_list)
            })

        else:
            return Response({'error': "game deve ser 'dota2' ou 'lol'"}, status=status.HTTP_400_BAD_REQUEST)
    
class metricsLOL:
    KD_Medio_top = 2.85
    CS_Medio_top = 248.42
    Gold_Medio_top = 12.07
    
    KD_Medio_Jg = 3.75
    CS_Medio_Jg = 216.61
    Gold_Medio_Jg = 11.9

    KD_Medio_Mid = 4.97
    CS_Medio_Mid = 273.53
    Gold_Medio_Jg = 13.2

    KD_Medio_ADC = 4.32
    CS_Medio_ADC = 294.88
    Gold_Medio_ADC = 14.09

    KD_Medio_Sup = 3.17
    CS_Medio_Sup = 31.82
    Gold_Medio_Sup = 7.96

class metricsDOTA2:
    KD_Medio_Carry = 5.76
    LH_Medio_Carry = 318.6
    DN_Medio_Carry = 16.3
    GPM_Medio_Carry = 681.3
    XPM_Medio_Carry = 766.6

    KD_Medio_Mid = 4.29
    LH_Medio_Mid = 335.79
    DN_Medio_Mid = 10.33
    GPM_Medio_Mid = 569.26
    XPM_Medio_Mid = 664.12

    KD_Medio_Offlane = 3.52
    LH_Medio_Offlane = 277.65
    DN_Medio_Offlane = 9.77
    GPM_Medio_Offlane = 520.44
    XPM_Medio_Offlane = 610.16

    KD_Medio_SoftSup = 2.92
    LH_Medio_SoftSup = 100.28
    DN_Medio_SoftSup = 2.51
    GPM_Medio_SoftSup = 316.19
    XPM_Medio_SoftSup = 443.08

    KD_Medio_HardSup = 2.5
    LH_Medio_HardSup = 86.83
    DN_Medio_HardSup = 2.62
    GPM_Medio_HardSup = 318.57
    XPM_Medio_HardSup = 449.65