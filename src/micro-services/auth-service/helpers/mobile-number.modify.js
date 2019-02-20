module.exports = msisdn => {
    if (msisdn.startsWith('+63')) return msisdn;
    if (msisdn.startsWith('63')) return `+${msisdn}`;
    return `+63${msisdn}`;
}