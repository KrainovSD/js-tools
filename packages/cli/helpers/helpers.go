package helpers

import (
	"bytes"
	"encoding/json"
	"sort"
)

type AliasValue struct {
	Value *string
}

func (a *AliasValue) String() string {
	if a.Value == nil {
		return ""
	}
	return *a.Value
}

func (a *AliasValue) Set(v string) error {
	if v != "" {
		*a.Value = v
	}
	return nil
}

func MarshalSortedIndent(v any, prefix, indent string) ([]byte, error) {
	var data, err = marshalSorted(v)
	if err != nil {
		return nil, err
	}

	var out bytes.Buffer
	if err = json.Indent(&out, data, prefix, indent); err != nil {
		return nil, err
	}

	return out.Bytes(), nil
}

func marshalSorted(v any) ([]byte, error) {
	var data, err = json.Marshal(v)
	if err != nil {
		return nil, err
	}

	var m map[string]any
	if err = json.Unmarshal(data, &m); err != nil {
		return nil, err
	}

	return marshalSortedMap(m), nil
}

func marshalSortedMap(m map[string]any) []byte {
	if len(m) == 0 {
		return []byte("{}")
	}

	var keys = make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var buf bytes.Buffer
	buf.WriteString("{")

	for i, key := range keys {
		if i > 0 {
			buf.WriteString(",")
		}

		var keyJSON []byte
		keyJSON, _ = json.Marshal(key)
		buf.Write(keyJSON)
		buf.WriteString(":")

		switch v := m[key].(type) {
		case map[string]any:
			buf.Write(marshalSortedMap(v))
		default:
			var valJSON []byte
			valJSON, _ = json.Marshal(v)
			buf.Write(valJSON)
		}
	}

	buf.WriteString("}")
	return buf.Bytes()
}
