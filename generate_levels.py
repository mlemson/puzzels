import random, json, time
from collections import defaultdict


def value_at(r,c,offset):
    return ((2*r + c + offset) % 5) + 1


def candidate_regions(rows, cols, offset):
    cells=[(r,c) for r in range(rows) for c in range(cols)]
    values={cell:value_at(*cell,offset) for cell in cells}
    nbr4={}
    for r,c in cells:
        nbr4[(r,c)]=[(rr,cc) for rr,cc in ((r+1,c),(r-1,c),(r,c+1),(r,c-1)) if 0<=rr<rows and 0<=cc<cols]
    global_seen=set(); out=[]
    for start in cells:
        stack=[frozenset([start])]; local=set()
        while stack:
            s=stack.pop()
            if s in local: continue
            local.add(s)
            vals=[values[x] for x in s]
            n=len(s)
            if len(set(vals))==n and set(vals)==set(range(1,n+1)):
                if s not in global_seen:
                    global_seen.add(s); out.append(s)
            if n>=5 or len(set(vals))<n:
                continue
            frontier=set()
            for x in s: frontier.update(nbr4[x])
            frontier-=set(s)
            for nb in frontier:
                ns=frozenset(set(s)|{nb})
                nvals=[values[x] for x in ns]
                if len(set(nvals))==len(nvals):
                    stack.append(ns)
    return out, values


def make_partition(rows, cols, rng, offset):
    candidates, values = candidate_regions(rows, cols, offset)
    allcells=set(values)
    bycell=defaultdict(list)
    for i,s in enumerate(candidates):
        for cell in s: bycell[cell].append(i)

    chosen=[]; covered=set(); steps=0
    def rec():
        nonlocal steps
        steps+=1
        if steps>200000: return False
        if len(covered)==len(allcells): return True
        best=None; opts=None
        for cell in allcells-covered:
            compatible=[i for i in bycell[cell] if candidates[i].isdisjoint(covered)]
            if not compatible: return False
            if opts is None or len(compatible)<len(opts):
                best,opts=cell,compatible
        rng.shuffle(opts)
        # mix sizes; avoid too many singletons but don't make every region size 5
        opts.sort(key=lambda i: (len(candidates[i])>=3, len(candidates[i]) + rng.random()*2.2), reverse=True)
        for i in opts[:30]:
            s=candidates[i]
            covered.update(s); chosen.append(i)
            if rec(): return True
            chosen.pop(); covered.difference_update(s)
        return False
    if not rec(): return None, None
    return [list(candidates[i]) for i in chosen], values


def prep(rows, cols, regions):
    cells=[(r,c) for r in range(rows) for c in range(cols)]
    reg_of={}; reg_size={}
    for ri,reg in enumerate(regions):
        reg_size[ri]=len(reg)
        for cell in reg: reg_of[cell]=ri
    neigh={}
    for r,c in cells:
        neigh[(r,c)]=[(rr,cc) for rr in range(max(0,r-1),min(rows,r+2)) for cc in range(max(0,c-1),min(cols,c+2)) if (rr,cc)!=(r,c)]
    return cells,reg_of,reg_size,neigh


def count_solutions(rows, cols, regions, clues, limit=2, return_nodes=False):
    cells,reg_of,reg_size,neigh=prep(rows,cols,regions)
    board=dict(clues); used=defaultdict(set); nodes=0; count=0
    for cell,v in board.items(): used[reg_of[cell]].add(v)
    def dom(cell):
        vals=set(range(1,reg_size[reg_of[cell]]+1))-used[reg_of[cell]]
        vals-={board[n] for n in neigh[cell] if n in board}
        return vals
    def rec():
        nonlocal nodes,count
        nodes+=1
        if count>=limit: return
        if len(board)==len(cells):
            count+=1; return
        best=None; bd=None
        for cell in cells:
            if cell in board: continue
            d=dom(cell)
            if not d: return
            if bd is None or len(d)<len(bd):
                best,bd=cell,d
                if len(d)==1: break
        for v in sorted(bd):
            board[best]=v; used[reg_of[best]].add(v)
            rec()
            used[reg_of[best]].remove(v); del board[best]
            if count>=limit: return
    rec()
    return (count,nodes) if return_nodes else count


def carve(rows, cols, regions, solution, rng, target_clues):
    clues=dict(solution)
    order=list(clues); rng.shuffle(order)
    # multiple passes can remove clues that weren't removable earlier only rarely, but helps variation
    for _ in range(2):
        changed=False
        rng.shuffle(order)
        for cell in order:
            if len(clues)<=target_clues: break
            if cell not in clues: continue
            old=clues.pop(cell)
            if count_solutions(rows,cols,regions,clues,2)!=1:
                clues[cell]=old
            else:
                changed=True
        if not changed: break
    return clues


def generate_one(level_id, rows, cols, difficulty, seed, target_ratio):
    rng=random.Random(seed)
    for attempt in range(100):
        offset=rng.randrange(5)
        regions,sol=make_partition(rows,cols,rng,offset)
        if not regions: continue
        target=max(3,round(rows*cols*target_ratio))
        clues=carve(rows,cols,regions,sol,rng,target)
        unique,nodes=count_solutions(rows,cols,regions,clues,2,True)
        if unique==1:
            return {
                'id': level_id,
                'rows': rows, 'cols': cols,
                'difficulty': difficulty,
                'seed': seed,
                'regions': [[[r,c] for r,c in reg] for reg in regions],
                'clues': {f'{r},{c}':v for (r,c),v in sorted(clues.items())},
                'solution': [sol[(r,c)] for r in range(rows) for c in range(cols)],
                'stats': {'clues':len(clues),'cells':rows*cols,'solverNodes':nodes,'regions':len(regions)}
            }
    raise RuntimeError('failed '+str(level_id))

specs=[]
# Langere campagne. Moeilijkheid loopt vooral op door minder startcijfers;
# zo blijven de borden ook op telefoon prettig groot.
for i in range(1,13):
    ratio=0.50 - 0.014*(i-1)
    specs.append((i,5,5,'Beginner',10000+i,ratio))
for i in range(13,29):
    ratio=0.39 - 0.010*(i-13)
    specs.append((i,6,6,'Normaal',20000+i,ratio))
for i in range(29,45):
    ratio=0.25 - 0.006*(i-29)
    specs.append((i,6,6,'Moeilijk',30000+i,ratio))
for i in range(45,61):
    ratio=0.16 - 0.003*(i-45)
    specs.append((i,6,6,'Expert',40000+i,ratio))

levels=[]; start=time.time()
for spec in specs:
    lvl=generate_one(*spec)
    levels.append(lvl)
    print('level',lvl['id'],lvl['rows'],lvl['stats'], 'elapsed',round(time.time()-start,2), flush=True)

with open('/mnt/data/tectonic_puzzlehub/games/tectonic/levels.js','w',encoding='utf8') as f:
    f.write('window.TECTONIC_LEVELS = ')
    json.dump(levels,f,separators=(',',':'))
    f.write(';\n')
print('done',len(levels))
