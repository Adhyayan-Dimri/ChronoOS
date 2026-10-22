"""
ChronoOS Episodic Memory Store & Semantic Vector Graph
Implements in-memory vector storage and cosine similarity retrieval across:
- Board mandates & governance thresholds
- Stakeholder relationship profiles & risk boundaries
- VIP correspondence & communication streams
- Transit preferences & buffer requirements
"""

import math
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

# Common English stopwords to improve vector retrieval precision
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", 
    "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", 
    "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", 
    "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", 
    "me", "more", "most", "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once", 
    "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own", "s", "same", "she", 
    "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", 
    "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", 
    "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", 
    "why", "will", "with", "would", "you", "your", "yours", "yourself", "yourselves"
}

def tokenize(text: str) -> List[str]:
    """Extracts alphanumeric tokens in lowercase, filtering common stopwords."""
    words = re.findall(r'[a-zA-Z0-9_\$]+', text.lower())
    return [w for w in words if w not in STOPWORDS and len(w) > 1]

class EpisodicMemoryGraph:
    """
    In-memory vector store mapping historical risk boundaries,
    board mandates, and VIP communications.
    """

    def __init__(self):
        from mock_executive_data import EPISODIC_MEMORY_GRAPH, COMMUNICATIONS_FEED
        self.memories: List[Dict[str, Any]] = list(EPISODIC_MEMORY_GRAPH)
        self.communications: List[Dict[str, Any]] = list(COMMUNICATIONS_FEED)
        self._reindex_vectors()

    def _reindex_vectors(self):
        """Builds TF-IDF vector tables for all episodic memories and communications."""
        # Index memories
        self.memory_tokens: List[List[str]] = []
        for mem in self.memories:
            corpus = f"{mem.get('entity', '')} {mem.get('category', '')} {mem.get('memory', '')}"
            self.memory_tokens.append(tokenize(corpus))

        # Build vocabulary & IDF for memories
        vocab = set()
        for doc in self.memory_tokens:
            vocab.update(doc)
        self.memory_vocab = sorted(list(vocab))
        self.memory_vocab_idx = {term: idx for idx, term in enumerate(self.memory_vocab)}
        
        num_docs = max(1, len(self.memories))
        self.memory_idf = {}
        for term in self.memory_vocab:
            df = sum(1 for doc in self.memory_tokens if term in doc)
            self.memory_idf[term] = math.log((num_docs + 1) / (df + 1)) + 1.0

        self.memory_vectors = [self._vectorize(tokens, self.memory_vocab_idx, self.memory_idf) for tokens in self.memory_tokens]

    def _vectorize(self, tokens: List[str], vocab_idx: Dict[str, int], idf_map: Dict[str, float]) -> List[float]:
        """Computes a normalized TF-IDF dense vector."""
        vec = [0.0] * len(vocab_idx)
        if not tokens:
            return vec

        term_counts: Dict[str, int] = {}
        for t in tokens:
            term_counts[t] = term_counts.get(t, 0) + 1

        for term, count in term_counts.items():
            if term in vocab_idx:
                tf = 1.0 + math.log(count)
                vec[vocab_idx[term]] = tf * idf_map[term]

        # L2 Normalization
        norm = math.sqrt(sum(v * v for v in vec))
        if norm > 0:
            vec = [v / norm for v in vec]
        return vec

    def _cosine_similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        """Calculates cosine similarity between two unit vectors."""
        return sum(a * b for a, b in zip(vec_a, vec_b))

    def search(self, query: str, top_k: int = 4, threshold: float = 0.05) -> List[Dict[str, Any]]:
        """
        Performs semantic vector search across the episodic memory graph.
        Returns matched memories ranked by vector cosine similarity.
        """
        q_tokens = tokenize(query)
        if not q_tokens:
            return []

        q_vec = self._vectorize(q_tokens, self.memory_vocab_idx, self.memory_idf)
        scored_results = []

        for idx, mem in enumerate(self.memories):
            sim = self._cosine_similarity(q_vec, self.memory_vectors[idx])
            
            # Substring entity boost
            if any(token in mem.get("entity", "").lower() for token in q_tokens):
                sim += 0.25
            if any(token in mem.get("category", "").lower() for token in q_tokens):
                sim += 0.15

            if sim >= threshold:
                item = dict(mem)
                item["relevance_score"] = round(sim, 3)
                scored_results.append((sim, item))

        scored_results.sort(key=lambda x: x[0], reverse=True)
        results = [item for _, item in scored_results[:top_k]]
        return results

    def search_communications(self, query: str, sender_filter: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Performs vector-enhanced search across executive email threads and Slack memos.
        """
        q_tokens = tokenize(query)
        matches = []
        for comm in self.communications:
            corpus = f"{comm.get('sender_name', '')} {comm.get('subject', '')} {comm.get('snippet', '')}".lower()
            
            # Sender filter check
            if sender_filter and sender_filter.lower() not in comm.get("sender_name", "").lower():
                continue

            # Calculate match score
            score = 0.0
            if query.lower() in corpus:
                score += 0.5
            for t in q_tokens:
                if t in corpus:
                    score += 0.15

            if score > 0 or not q_tokens:
                c_copy = dict(comm)
                c_copy["relevance_score"] = round(score, 3)
                matches.append((score, c_copy))

        matches.sort(key=lambda x: x[0], reverse=True)
        return [item for _, item in matches[:top_k]]

    def add_memory(self, entity: str, memory: str, category: str = "executive_preference") -> Dict[str, Any]:
        """Dynamically incorporates a new episodic memory record and reindexes vectors."""
        new_record = {
            "id": f"mem_{len(self.memories) + 1:03d}",
            "category": category,
            "entity": entity,
            "memory": memory,
            "last_updated": datetime.now(timezone.utc).strftime("%Y-%m-%d")
        }
        self.memories.append(new_record)
        self._reindex_vectors()
        return new_record

    def get_risk_boundaries(self) -> List[Dict[str, Any]]:
        """Returns risk and financial thresholds from episodic memory."""
        return [m for m in self.memories if m.get("category") in ("board_governance", "m_and_a_strategy", "stakeholder_policy")]

    def get_context_by_entity(self, entity_name: str) -> Optional[Dict[str, Any]]:
        """Direct retrieval by entity identifier."""
        for m in self.memories:
            if entity_name.lower() in m.get("entity", "").lower():
                return m
        return None

# Singleton instance for server-wide access
episodic_memory_graph = EpisodicMemoryGraph()
