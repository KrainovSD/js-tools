package helpers

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
