"""
Unit tests for ChronoOS Episodic Memory Graph & Semantic Vector Store
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from memory_graph import EpisodicMemoryGraph, tokenize

def test_tokenize():
    tokens = tokenize("Acme Corp's $12M Liability Cap and Redline!")
    assert "acme" in tokens
    assert "corp" in tokens
    assert "liability" in tokens
    assert "cap" in tokens
    assert "redline" in tokens
    assert "and" not in tokens  # Stopword removed

def test_semantic_vector_search_sarah():
    graph = EpisodicMemoryGraph()
    results = graph.search("Sarah Chen risk boundaries and indemnification")
    assert len(results) > 0
    top_match = results[0]
    assert "Sarah Chen" in top_match["entity"]
    assert "relevance_score" in top_match
    assert top_match["relevance_score"] > 0

def test_semantic_vector_search_transit():
    graph = EpisodicMemoryGraph()
    results = graph.search("flight buffer airport travel preferences")
    assert len(results) > 0
    # Should identify Alex Mercer JFK transit preference
    entities = [r["entity"] for r in results]
    assert any("Alex Mercer" in e for e in entities)

def test_search_communications():
    graph = EpisodicMemoryGraph()
    results = graph.search_communications("merger redline liability", sender_filter="Sarah Chen")
    assert len(results) > 0
    assert "Sarah Chen" in results[0]["sender_name"]
    assert "Section 9.2" in results[0]["snippet"]

def test_dynamic_add_memory():
    graph = EpisodicMemoryGraph()
    initial_count = len(graph.memories)
    new_mem = graph.add_memory(
        entity="Project Titan",
        memory="Target acquisition valuation is strictly $25M with a 10% escrow holdback.",
        category="m_and_a_strategy"
    )
    assert len(graph.memories) == initial_count + 1
    assert new_mem["entity"] == "Project Titan"

    # Search should now rank the new memory top
    searched = graph.search("Titan escrow holdback valuation")
    assert searched[0]["entity"] == "Project Titan"

def test_risk_boundaries():
    graph = EpisodicMemoryGraph()
    boundaries = graph.get_risk_boundaries()
    assert len(boundaries) >= 2
    categories = {b["category"] for b in boundaries}
    assert "board_governance" in categories or "m_and_a_strategy" in categories
